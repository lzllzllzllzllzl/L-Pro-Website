const careActions=[
['start','Start selected care','Start care','Thumbs up','Starts the reviewed plan after positioning confirmation.'],
['stop','Stop all care','Stop care','Open palm','Ends the current session and releases contact in the demo.'],
['pause','Pause care','Pause care','Closed fist','Pauses the current demo stage.'],
['resume','Resume care','Resume care','Two fingers','Continues the paused demo stage.'],
['status','Read care status','What stage is it','Point up','Reports the current stage without changing care.'],
['gentle','Gentler massage','Gentler massage','Swipe down','Sets massage to Gentle in all enabled scalp and length zones.'],
['cool','Cool drying','Cool drying','Swipe left','Sets Cool temperature in every enabled drying zone.']];
function normaliseCommand(s){return String(s).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,'').replace(/\s+/g,' ').trim()}
function recommendedMappings(){return Object.fromEntries(careActions.map(([id,,voice,gesture])=>[id,{voice,gesture}]))}
function mappingError(map,voiceOn,gestureOn){for(const kind of ['voice','gesture']){if(!(kind==='voice'?voiceOn:gestureOn))continue;const seen=new Set();for(const [id] of careActions){const v=normaliseCommand(map[id]?.[kind]||'');if(!v)return 'Add a '+kind+' command for every function, or turn that control method off.';if(seen.has(v))return 'Each '+kind+' command must map to only one function. Remove duplicate commands.';seen.add(v)}}return ''}
function matchMapping(map,kind,input){const n=normaliseCommand(input);return careActions.find(([id])=>n&&normaliseCommand(map[id]?.[kind])===n)?.[0]||null}
