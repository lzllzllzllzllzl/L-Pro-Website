// Camera cursor — accessibility prototype for users who cannot hold a mouse
// (Parkinson's, tremor, limited grip). The webcam tracks one hand (MediaPipe
// HandLandmarker, WASM, fully on-device); the index fingertip drives a virtual
// cursor and a thumb-index pinch fires a click. A dwell mode (hold steady over
// a target) covers users who cannot pinch at all. A One Euro filter removes
// low-speed tremor jitter; light magnetic snapping eases targeting.
// No video ever leaves the device.
(function(){
var active=false,landmarker=null,stream=null,rafId=0,lastVideoTime=-1;
var mode=localStorage.getItem('lpro-cursor-mode')||'pinch';
var lostFrames=99,handSeen=false,pinched=false;
var fx=null,fy=null,cursorPos=null,magnetEl=null;
var DWELL_MS=1200,DWELL_RADIUS=26,REARM_MS=1400;
var PINCH_ON=0.32,PINCH_OFF=0.44,MARGIN=0.12;
var dwell={x:0,y:0,t0:0,armed:true};
var INTERACTIVE='button,a,input,select,textarea,label,summary,[onclick],[role="button"]';
var CONNECTIONS=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
var root=null,video=null,canvas=null,ctx=null,cursorEl=null,ringEl=null,magnetElBox=null,toolStatus=null;

// --- One Euro filter: strong smoothing at low speed, low lag at high speed ---
function LowPass(){this.y=null}
LowPass.prototype.filter=function(x,a){this.y=this.y===null?x:a*x+(1-a)*this.y;return this.y};
function OneEuro(minCutoff,beta,dCutoff){this.minCutoff=minCutoff;this.beta=beta;this.dCutoff=dCutoff;this.xf=new LowPass();this.dxf=new LowPass();this.t=null}
OneEuro.prototype.alpha=function(cutoff,dt){var tau=1/(2*Math.PI*cutoff);return 1/(1+tau/dt)};
OneEuro.prototype.filter=function(x,t){
if(this.t===null){this.t=t;this.xf.filter(x,1);this.dxf.filter(0,1);return x}
var dt=Math.max((t-this.t)/1000,1e-3);this.t=t;
var dx=(x-this.xf.y)/dt,edx=this.dxf.filter(dx,this.alpha(this.dCutoff,dt));
return this.xf.filter(x,this.alpha(this.minCutoff+this.beta*Math.abs(edx),dt))};

function status(msg){if(toolStatus)toolStatus.textContent=msg;var m=document.getElementById('camera-status');if(m)m.textContent=msg;
var t=document.getElementById('camera-cursor-toggle');if(t)t.textContent=active?'Turn off camera cursor':'Turn on camera cursor'}

function buildOverlay(){
root=document.createElement('div');root.id='gesture-overlay';root.setAttribute('data-gesture-overlay','');
root.innerHTML='<div class="gtoolbar"><span id="gtool-status"></span><button id="gtool-close" aria-label="Stop camera cursor" title="Stop camera cursor">×</button></div>'
+'<div class="gvideo-wrap"><video id="gvideo" playsinline muted></video><canvas id="gcanvas" width="176" height="132"></canvas></div>'
+'<div class="gcursor" id="gcursor"><div class="gcursor-ring"></div><div class="gcursor-dot"></div></div>'
+'<div class="gmagnet" id="gmagnet"></div>';
document.body.append(root);
video=root.querySelector('#gvideo');canvas=root.querySelector('#gcanvas');ctx=canvas.getContext('2d');
cursorEl=root.querySelector('#gcursor');ringEl=root.querySelector('.gcursor-ring');magnetElBox=root.querySelector('#gmagnet');
toolStatus=root.querySelector('#gtool-status');
root.querySelector('#gtool-close').addEventListener('click',disable);
}

async function enable(){
if(active)return;
if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){status('Camera unavailable. Use touch controls instead.');return}
if(!window.isSecureContext){status('Camera needs a secure connection. Open this page via localhost or https.');return}
active=true;status('Requesting camera…');
try{
buildOverlay();
stream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'},audio:false});
}catch(e){cleanupDom();active=false;status(e&&e.name==='NotAllowedError'?'Camera permission denied. Allow it in the browser address bar, or use touch controls.':'Camera unavailable. Use touch controls instead.');return}
video.srcObject=stream;
try{await video.play()}catch(e){}
status('Loading hand tracking…');
try{await ensureLandmarker()}catch(e){stopCamera();cleanupDom();active=false;status('Loading the hand model needs an internet connection.');return}
fx=new OneEuro(1.1,0.028,1.0);fy=new OneEuro(1.1,0.028,1.0);
lostFrames=99;handSeen=false;pinched=false;
saved.gestures=true;persist();
status(mode==='dwell'?'Dwell click · Esc to exit':'Pinch to click · Esc to exit');
document.documentElement.classList.add('gcursor-on');
rafId=requestAnimationFrame(loop);
}

function stopCamera(){if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}video&&(video.srcObject=null)}

function cleanupDom(){if(rafId)cancelAnimationFrame(rafId);rafId=0;
if(root){root.remove();root=video=canvas=ctx=cursorEl=ringEl=magnetElBox=toolStatus=null}
document.documentElement.classList.remove('gcursor-on');magnetEl=null}

function disable(){if(!active)return;active=false;stopCamera();cleanupDom();status('Camera cursor stopped.')}

async function ensureLandmarker(){
if(landmarker)return;
const v=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14');
const files=await v.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
try{landmarker=await v.HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numHands:1})}
catch(e){landmarker=await v.HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numHands:1})}
}

function loop(){
if(!active)return;
if(video.readyState>=2&&video.currentTime!==lastVideoTime){
lastVideoTime=video.currentTime;
let res=null;
try{res=landmarker.detectForVideo(video,performance.now())}catch(e){}
process(res);
}
drawPreview();
rafId=requestAnimationFrame(loop);
}

function process(res){
const hands=res&&res.landmarks;
latestLandmarks=hands&&hands.length?hands[0]:null;
if(!hands||!hands.length){lostFrames++;
if(lostFrames>6){handSeen=false;pinched=false;dwell.armed=true;cursorEl&&cursorEl.classList.add('dim');ringEl&&(ringEl.style.background='')}
return}
lostFrames=0;handSeen=true;
const lm=hands[0];
const scale=Math.hypot(lm[0].x-lm[9].x,lm[0].y-lm[9].y)||1e-4;
const pinchRatio=Math.hypot(lm[4].x-lm[8].x,lm[4].y-lm[8].y)/scale;
const ix=1-lm[8].x,iy=lm[8].y; // mirrored selfie view
let nx=(ix-MARGIN)/(1-2*MARGIN),ny=(iy-MARGIN)/(1-2*MARGIN);
nx=Math.min(1,Math.max(0,nx));ny=Math.min(1,Math.max(0,ny));
const now=performance.now();
let sx=fx.filter(nx*window.innerWidth,now),sy=fy.filter(ny*window.innerHeight,now);
const mag=findMagnet(sx,sy);
if(mag){const p=mag.point;sx+=(p.x-sx)*0.38;sy+=(p.y-sy)*0.38}
cursorPos={x:sx,y:sy};
placeCursor(sx,sy,mag);
if(mode==='pinch'){
if(!pinched&&pinchRatio<PINCH_ON){pinched=true;fire(sx,sy)}
else if(pinched&&pinchRatio>PINCH_OFF)pinched=false;
ringEl&&(ringEl.style.background=pinched?'var(--fg)':'');
}else dwellStep(sx,sy,mag,now);
}

function findMagnet(x,y){
let best=null,bestD=90;
document.querySelectorAll(INTERACTIVE).forEach(function(el){
if(el.closest('[data-gesture-overlay]')||el.disabled)return;
const r=el.getBoundingClientRect();
if(r.width<2||r.height<2)return;
const px=Math.min(Math.max(x,r.left+3),r.right-3),py=Math.min(Math.max(y,r.top+3),r.bottom-3);
const d=Math.hypot(px-x,py-y);
if(d<bestD){bestD=d;best={el:el,point:{x:px,y:py},rect:r}}
});
return best;
}

function placeCursor(x,y,mag){
cursorEl.classList.remove('dim');
cursorEl.style.transform='translate('+Math.min(x,innerWidth-2)+'px,'+Math.min(y,innerHeight-2)+'px)';
if(mag){magnetEl=mag.el;const r=mag.rect;
magnetElBox.style.cssText='opacity:1;left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px';
}else{magnetEl=null;magnetElBox.style.cssText='opacity:0'}
}

function dwellStep(x,y,mag,now){
const moved=Math.hypot(x-dwell.x,y-dwell.y);
if(moved>DWELL_RADIUS){dwell.x=x;dwell.y=y;dwell.t0=now;dwell.armed=true}
if(!dwell.armed){dwell.t0=now;ringEl&&(ringEl.style.background='');return}
const p=Math.min((now-dwell.t0)/DWELL_MS,1);
ringEl&&(ringEl.style.background='conic-gradient(var(--fg) '+(p*100)+'%, transparent 0)');
if(p>=1){fire(x,y);dwell.armed=false;dwell.t0=now+REARM_MS;
setTimeout(function(){dwell.armed=true},REARM_MS)}
}

function fire(x,y){
const els=document.elementsFromPoint(x,y)||[];
const el=els.find(function(e){return !e.closest||!e.closest('[data-gesture-overlay]')});
if(!el)return;
const target=el.closest(INTERACTIVE)||el;
const opts={bubbles:true,cancelable:true,view:window,clientX:x,clientY:y,pointerId:1,pointerType:'mouse',isPrimary:true};
try{target.dispatchEvent(new PointerEvent('pointerdown',opts));target.dispatchEvent(new PointerEvent('pointerup',opts))}catch(e){}
target.dispatchEvent(new MouseEvent('click',opts));
cursorEl&&(cursorEl.classList.add('fired'),setTimeout(function(){cursorEl&&cursorEl.classList.remove('fired')},180));
}

function drawPreview(){
if(!ctx||!video||!video.videoWidth)return;
const w=canvas.width,h=canvas.height;
ctx.save();ctx.translate(w,0);ctx.scale(-1,1);ctx.drawImage(video,0,0,w,h);ctx.restore();
const lm=latestLandmarks;
if(!lm){ctx.clearRect(0,0,w,h);
ctx.save();ctx.translate(w,0);ctx.scale(-1,1);ctx.drawImage(video,0,0,w,h);ctx.restore();
if(!handSeen){ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='11px sans-serif';
ctx.fillText(localStorage.getItem('lpro-lang')==='zh'?'请把手伸到摄像头前。':'Show your hand to the camera.',10,h-10)}return}
ctx.save();ctx.translate(w,0);ctx.scale(-1,1);ctx.drawImage(video,0,0,w,h);ctx.restore();
ctx.fillStyle='white';
lm.forEach(function(p,i){
ctx.beginPath();ctx.arc((1-p.x)*w,p.y*h,i===4||i===8?4:2.2,0,7);ctx.fill();
});
const t4=lm[4],t8=lm[8];
ctx.strokeStyle=pinched?'#fff':'rgba(255,255,255,.5)';ctx.lineWidth=pinched?3:1.5;
ctx.beginPath();ctx.moveTo((1-t4.x)*w,t4.y*h);ctx.lineTo((1-t8.x)*w,t8.y*h);ctx.stroke();
ctx.restore();
}

function setMode(m){mode=m;localStorage.setItem('lpro-cursor-mode',m);
if(active)status(m==='dwell'?'Dwell click · Esc to exit':'Pinch to click · Esc to exit')}

window.addEventListener('keydown',function(e){if(e.key==='Escape'&&active)disable()});
window.addEventListener('beforeunload',function(){if(active)stopCamera()});

window.GestureCursor={
toggle:function(){active?disable():enable()},
isActive:function(){return active},
mode:function(){return mode},
setMode:setMode
};
})();
