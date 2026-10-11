// L Pro i18n overlay — English is the source of truth; Chinese is rendered in place.
// Strategy: after every DOM change (render, modals, guide, async status text) a
// MutationObserver re-applies an EN→ZH phrase dictionary to text nodes and a few
// attributes. Select values / command phrases stay English so saved data and
// matching logic are untouched. Switching language reloads the page.
(function(){
var MAP={
// chrome / static shell
"L Pro — Your care. Your way.":"L Pro — 你的护理，由你做主。",
"/ CARE STUDIO":"护理体验站",
"Home":"首页","Remote Care":"远程护理","My Profile":"我的档案",
"Concept experience":"概念体验",
"Designed around you.":"为你而设计。","Care without limits.":"护理，没有界限。",
"PERSONALISED HAIR CARE":"个性化头发护理",
"L Pro · Professional care, on your terms.":"L Pro · 专属你的专业护理。",
"Interactive concept · No physical device connected":"交互概念演示 · 未连接实体设备",
"Close":"关闭",
// shared controls
"← Home":"← 返回首页",
"Voice control":"语音控制","Gesture control":"手势控制","Remote care":"远程护理",
"Ready to listen":"随时聆听","Off · tap to enable":"未开启 · 点击开启",
"Enabled · demo mode":"已开启 · 演示模式",
"Stay close, wherever you are":"距离再远，也能陪伴",
"Use your saved phrases":"使用你保存的短语","Set up function mappings":"设置功能映射",
"Use your saved gestures":"使用你保存的手势","Choose or customise gestures":"选择或自定义手势",
"Family care with on-site confirmation":"家人护理 · 需现场确认",
// home
"The L Pro experience / 01":"L Pro 体验 / 01",
"Your care.":"你的护理。","Your way.":"由你做主。","Your control.":"由你掌控。",
"Professional hair care, made personal.":"专业头发护理，为个人定制。",
"A little more freedom. A moment for you.":"多一点自由，一段属于你的时光。",
"Helen’s L Pro · Demo device ready":"Helen 的 L Pro · 演示设备就绪",
"View Live Care":"查看实时护理","Begin Care":"开始护理","Your scalp profile":"你的头皮档案",
"Your last preference:":"你上次的偏好：",
"Gentle Long Hair Care":"轻柔长发护理","Standard Long Hair Care":"标准长发护理",
"Gentle Care":"轻柔护理","Standard Care":"标准护理",
"Care that remembers you.":"懂你的护理。","Explore your profile":"查看你的档案",
"Your preferences, scalp images and session history. Together in one place.":"你的偏好、头皮照片与护理记录，都集中在一处。",
"PERSONAL CARE / PRECISE CONTROL":"个人护理 / 精准控制",
"A considered routine.":"一套精心设计的流程。","Nine scalp zones. Three hair zones.":"九个头皮分区，三个发段分区。","Every detail, yours.":"每个细节，由你决定。",
"✓ Demo device connected":"✓ 演示设备已连接","○ Device not connected":"○ 设备未连接",
"View Session":"查看会话","View session":"查看会话","Edit Zone Plan":"编辑分区方案",
"SCALP ZONES":"头皮分区","LONG HAIR ZONES":"长发分区","PERSONAL ROUTINE":"个人流程",
"Your saved care plan":"你保存的护理方案",
"Independent settings for massage, wash, conditioning and drying.":"按摩、清洗、护发素与吹干，各自独立设置。",
"Open Plan":"打开方案",
"Connect Device":"连接设备","Set Up My Controls":"设置我的控制方式",
// setup
"01 / GET READY":"01 / 准备就绪","Make yourself comfortable.":"让自己舒服一些。",
"Position the device around your natural seated posture.":"按照你自然的坐姿，将设备环绕定位。",
"Adjust & Align":"调整与对齐","Match the height and position to your head.":"把高度和位置调整到适合你的头部。",
"Position Your Hair":"安放你的头发","Guide long hair into the dedicated chamber.":"将长发导入专用发舱。",
"Check Your Fit":"检查佩戴","Keep your face clear and the seal comfortable.":"确保脸部无遮挡、密封舒适。",
"My head and hair are positioned comfortably.":"我的头部和头发已舒适就位。",
"Please confirm your positioning first.":"请先确认你的佩戴就位。",
"Continue":"继续",
// capture
"02 / HAIR & SCALP":"02 / 头发与头皮","A closer look.":"更近一步的了解。",
"Add a scalp photo and tell us what feels right for you.":"添加一张头皮照片，并告诉我们你的感受。",
"Scalp image":"头皮图像","No camera connected in this prototype. Upload an image to preview the experience.":"此原型未连接摄像头。上传一张图片即可预览体验。",
"Choose image":"选择图片","Hair length":"头发长度",
"Long":"长发","Medium":"中长发","Short":"短发",
"Main concern":"主要困扰","Tangling":"打结","Dryness":"干燥","Oiliness":"出油","No specific concern":"无明显困扰",
"Massage preference":"按摩力度","Gentle":"轻柔","Standard":"标准",
"View Care Insights":"查看护理洞察","Skip to care":"跳过，直接护理",
"Your uploaded scalp image":"你上传的头皮图像",
// insights
"03 / YOUR INSIGHTS":"03 / 你的洞察","Understand your care.":"更懂你的护理。",
"A care suggestion based on your answers.":"基于你的回答生成的护理建议。",
"HAIR PROFILE":"头发档案",
"Long hair":"长发","Medium hair":"中长发","Short hair":"短发",
"Tangling reported":"主要困扰：打结","Dryness reported":"主要困扰：干燥","Oiliness reported":"主要困扰：出油","No specific concern reported":"主要困扰：无明显困扰",
"Gentle massage preferred":"偏好轻柔按摩","Standard massage preferred":"偏好标准按摩",
"SCALP IMAGE":"头皮图像","Image added":"已添加图像","No image added":"未添加图像",
"This prototype does not analyse images or assess scalp health.":"此原型不会分析图像，也不会评估头皮健康。",
"Personalised care concept, not a medical diagnosis. Recommendations here use your selected preferences only.":"个性化护理概念，并非医疗诊断。此处建议仅基于你所选择的偏好。",
"View Recommended Care":"查看推荐护理",
// plan
"04 / MY CARE":"04 / 我的护理","Make it yours.":"由你定制。",
"Choose a plan for Mum.":"为妈妈选择一套方案。","Recommended from your preferences.":"根据你的偏好推荐。",
"YOUR PLAN":"你的方案",
"You can change every optional step below.":"下方每一个步骤都可以调整。",
"Wash & Rinse":"清洗与冲洗","Cleanse and rinse":"清洁并冲洗",
"Scalp Massage":"头皮按摩","Gentle zoned massage":"分区分级轻柔按摩",
"Long Hair Care":"长发护理","Care through the lengths":"发中至发梢护理",
"Red Light Care":"红光护理","Optional care module":"可选护理模块",
"Drying":"吹干","Gentle airflow":"柔和气流",
"Send Care Plan":"发送护理方案","Review Care":"确认护理方案",
"Choose at least one care step.":"请至少选择一个护理步骤。",
// review
"05 / REVIEW":"05 / 确认","Ready when you are.":"一切就绪，等你开始。",
"Helen · Home L Pro":"Helen · 家用 L Pro",
"Washing":"清洗",
"Position confirmed":"已确认就位","Position confirmation needed":"需要确认就位",
"Start Care":"开始护理","Edit Plan":"编辑方案","Edit":"编辑",
// live
"06 / LIVE CARE":"06 / 实时护理","Your moment of care.":"属于你的护理时刻。","Care is not running.":"护理尚未开始。",
"Mum · Remote demo":"妈妈 · 远程演示","Helen · Demo session":"Helen · 演示会话",
"Stop Care":"停止护理","Complete demo":"完成演示","Next demo stage":"下一演示阶段",
"Simulation only. Advance the stages to explore the experience.":"仅为模拟演示。可逐段推进体验流程。",
"Back to Home":"返回首页",
"Care in progress":"护理进行中",
// summary
"07 / COMPLETE":"07 / 完成","Care ended.":"护理已结束。","Care complete.":"护理完成。",
"The demo has stopped and contacts have released.":"演示已停止，接触部件已释放。",
"Your demo session has finished and contacts have released.":"演示会话已结束，接触部件已释放。",
"Ready to exit · Demo":"可以取下设备 · 演示","Your care, remembered.":"你的护理，已被记住。",
"How did the massage feel?":"这次按摩感觉如何？",
"Comfortable":"舒适","Too gentle":"太轻","Too strong":"太重",
"Remember my preferences":"记住我的偏好","Save My Care":"保存我的护理",
"Stopping care.":"正在停止护理。","Supply and massage stopped in the demo. Releasing contact…":"演示中已停止供给与按摩，正在释放接触部件……",
"Complete positioning first.":"请先完成佩戴确认。",
// remote care
"REMOTE CARE":"远程护理","Close, from anywhere.":"天涯咫尺的陪伴。",
"Support someone you care about, with their permission.":"在对方许可下，照顾你在乎的人。",
"Authorised family member · Demo":"已授权的家人 · 演示",
"Mum":"妈妈","Care Home L Pro":"养老院 L Pro",
"Online · Waiting for on-site readiness":"在线 · 等待现场就绪",
"Choose Care Plan":"选择护理方案",
"This is a simulated family profile. Remote startup requires fresh on-site confirmation for each session.":"这是一个模拟的家人档案。每次远程启动都需要现场重新确认。",
"REMOTE / READINESS":"远程 / 就绪确认","Waiting for the caregiver.":"等待现场照护者。",
"Your chosen plan is ready. The person on site must confirm positioning before you can start.":"你选择的方案已就绪。现场人员需先确认佩戴就位，你才可以开始。",
"Mum · Care Home L Pro":"妈妈 · 养老院 L Pro","Awaiting confirmation":"等待确认中",
"Simulate on-site confirmation":"模拟现场确认","Caregiver ready · Demo confirmation":"照护者已就绪 · 演示确认",
"Start Remote Care":"开始远程护理",
// profile
"MY PROFILE":"我的档案","Care that knows you.":"懂你的护理。",
"Your preferences":"你的偏好",
"Gentle massage":"轻柔按摩","Standard massage":"标准按摩",
"Edit preferences":"编辑偏好","Control settings":"控制设置","Voice":"语音","Gestures":"手势",
"Care History":"护理记录","Ended early":"提前结束","Complete":"已完成",
"Your saved sessions will appear here.":"你保存的护理记录将显示在这里。",
"Export records":"导出记录","Delete saved data":"删除保存的数据",
"Delete your saved preferences and records?":"确定删除已保存的偏好与记录吗？",
"Preferences and records are stored in this browser only. Uploaded photos remain in memory and are cleared on reload.":"偏好与记录仅保存在此浏览器中。上传的照片仅存于内存，刷新后即被清除。",
// appearance (upgrade.js)
"DISPLAY PREFERENCES":"显示偏好","Clarity, your way.":"清晰，随你而定。","Appearance":"外观",
"dark":"深色","light":"浅色","system":"跟随系统",
"High contrast":"高对比度","Larger text":"更大文字","Reduce motion":"减少动态效果",
"Selection uses a checkmark and outline. Active areas use a pattern and label. Colour is never the only signal.":"选中状态用对勾和描边表示，激活区域用图案和标签表示。颜色从来不是唯一的信号。",
"Appearance & Accessibility":"外观与无障碍","◐ Appearance":"◐ 外观",
// zones (upgrade.js)
"Left front":"左前","Front centre":"前中","Right front":"右前","Left crown":"左顶","Crown centre":"头顶中央","Right crown":"右顶","Left rear":"左后","Rear centre":"后中","Right rear":"右后",
"ZONE CARE / CUSTOMISE":"分区护理 / 自定义","Precision. Made personal.":"精准，且个性化。",
"Select a region. Adjust its care. Keep the rest exactly as it is.":"选择一个区域，调整它的护理，其余保持不变。",
"Scalp / 9 zones":"头皮 / 9 区","Long hair / 3 zones":"长发 / 3 区",
"Wash":"清洗","Massage":"按摩","Conditioner":"护发素","Dry":"吹干","Red light":"红光",
"FOREHEAD / YOUR LEFT ← → YOUR RIGHT":"额头 / 你的左侧 ← → 你的右侧",
"LONG HAIR / VERTICAL SECTIONS":"长发 / 纵向分段","BACK OF HEAD":"后脑","HAIR ENDS":"发梢",
"Upper lengths":"上段","Mid-lengths":"中段","Ends":"发梢",
"Select all":"全选","Clear":"清除","Left column":"左列","Centre":"中列","Right column":"右列","Front row":"前排","Crown row":"顶排","Rear row":"后排",
"Choose a zone":"请选择一个分区","Changes apply only to these areas.":"更改仅应用于这些区域。",
"Supply level":"供给档位","Massage intensity":"按摩强度","Conditioner amount":"护发素用量","Airflow":"气流","Red light care":"红光护理","Temperature":"温度",
"Off":"关闭","On":"开启","Firm":"有力","Cool":"凉风","Low":"低","Light":"轻量",
"Mixed settings":"多项不同设置","Select a zone":"请选择区域",
"Independent control is demonstrated conceptually. Available settings must match the final hardware.":"此处以概念方式演示独立控制。可用档位需与最终硬件一致。",
"Save Zone Settings":"保存分区设置","✓ Zone settings saved":"✓ 分区设置已保存",
"Refine every region.":"精细到每个区域。","9 scalp areas. 3 length areas. Independent settings for each function.":"9 个头皮区域、3 个发段区域，每项功能独立设置。","Customise Zones":"自定义分区",
"Your zone settings":"你的分区设置","Edit Zones":"编辑分区",
"Active regions":"激活区域","Active":"激活",
"Scalp & length massage":"头皮与发段按摩","Wash & rinse":"清洗与冲洗",
// commands (command-model.js / command-controls.js)
"Start selected care":"启动所选护理","Stop all care":"停止全部护理","Read care status":"播报护理状态",
"Pause care":"暂停护理","Resume care":"继续护理","Gentler massage":"更轻柔的按摩","Cool drying":"凉风吹干",
"Starts the reviewed plan after positioning confirmation.":"确认佩戴就位后，启动已确认的方案。",
"Ends the current session and releases contact in the demo.":"结束当前会话，并在演示中释放接触部件。",
"Pauses the current demo stage.":"暂停当前演示阶段。",
"Continues the paused demo stage.":"继续被暂停的演示阶段。",
"Reports the current stage without changing care.":"播报当前阶段，不改变护理。",
"Sets massage to Gentle in all enabled scalp and length zones.":"将所有已启用的头皮和发段分区的按摩设为轻柔。",
"Sets Cool temperature in every enabled drying zone.":"将所有已启用的吹干分区设为凉风温度。",
"Finish this session first.":"请先结束当前会话。",
"Command mappings stay fixed while care is running. Your Stop Care control remains available.":"护理进行中，指令映射保持锁定。你仍可使用停止护理按钮。",
"✓ Recognised":"✓ 已识别",". Preview only; no care action executed.":"。仅为预览，不会执行护理动作。",
"No match. Enter one of your assigned commands exactly.":"未匹配。请完整输入你设置的指令。",
"No care is running.":"当前没有进行中的护理。","Care stopped.":"护理已停止。",
"Paused":"已暂停","Running":"运行中",
"Save your command settings first.":"请先保存你的指令设置。","Connect the demo device first.":"请先连接演示设备。",
"Complete positioning and review your plan first.":"请先完成佩戴确认并查看方案。",
"Starting your selected care.":"正在启动你选择的护理。","Start a session first.":"请先开始一次会话。",
"Care paused.":"护理已暂停。","Care resumed.":"护理已继续。",
"Enabled scalp and length zones now use Gentle massage.":"已启用的头皮和发段分区现在使用轻柔按摩。",
"Enabled drying zones now use Cool temperature.":"已启用的吹干分区现在使用凉风温度。",
"Command not recognised.":"无法识别的指令。",
"Voice control is off. Enable it in Command Settings.":"语音控制未开启。请在指令设置中开启。",
"No match. Use one of your saved phrases.":"未匹配。请使用你保存的短语。",
"YOUR SAVED VOICE COMMANDS":"你保存的语音指令","Speak your command.":"说出你的指令。",
"Voice enabled":"语音已开启","Voice disabled":"语音未开启",
"Demo device connected":"演示设备已连接","Device not connected":"设备未连接",
"Tap to speak. Browser permission is requested only now.":"点击开始说话。仅在此刻请求浏览器权限。",
"Edit command mappings":"编辑指令映射",
"English speech recognition when supported. Commands control this demo only.":"语音识别（在支持的浏览器中）。指令仅控制本演示。",
"Enable voice control first.":"请先开启语音控制。",
"Speech recognition is unavailable here. Use the touch controls.":"此浏览器不支持语音识别，请使用触控操作。",
"Microphone unavailable. Check permission or use touch controls.":"麦克风不可用。请检查权限或改用触控操作。",
"Listening…":"正在聆听……",
"Tap to speak":"点击说话","Listen for saved command":"聆听已保存的指令",
"YOUR SAVED GESTURE COMMANDS":"你保存的手势指令","One gesture. One action.":"一个手势，一个动作。",
"Gesture control enabled":"手势控制已开启","Gesture control disabled":"手势控制未开启",
"· recognition is simulated.":"· 识别为模拟。",
"Choose a gesture to simulate recognition.":"选择一个手势来模拟识别。",
"No camera tracking or physical-device gesture training is active.":"未启用摄像头追踪或实体设备手势训练。",
"Enable gesture control in Command Settings first.":"请先在指令设置中开启手势控制。",
"SETUP / 01 CONFIGURE → 02 CONNECT → 03 GET READY":"设置 / 01 配置 → 02 连接 → 03 准备",
"Your command. Your function.":"你的指令，你的功能。",
"Start with recommended mappings or create your own. Each phrase and gesture triggers exactly one function.":"使用推荐映射，或创建自己的映射。每条短语和手势只触发一个功能。",
"Restore recommendations":"恢复推荐设置",
"Custom gestures are saved as named mappings in this prototype. Actual recording and recognition require the device gesture sensor.":"在此原型中，自定义手势以命名映射保存。实际的录制与识别需要设备手势传感器。",
"CARE FUNCTION":"护理功能","VOICE PHRASE":"语音短语","GESTURE":"手势","Gesture":"手势",
"Say":"说出","Recommended:":"推荐：","Choose a suggestion or name your own.":"从建议中选择，或自定义命名。",
"Try your mapping":"测试你的映射","Test recognition without starting or stopping care.":"测试识别，不会开始或停止护理。",
"Control method":"控制方式","Voice phrase":"语音短语","Gesture name":"手势名称","Command":"指令",
"Enter your phrase or gesture":"输入你的短语或手势",
"Test mapping":"测试映射","Save & connect device":"保存并连接设备","Back home":"返回首页",
"SETUP / 02 CONNECT DEVICE":"设置 / 02 连接设备","Connect after you configure.":"先配置，再连接。",
"01 · Command settings":"01 · 指令设置","✓ Saved":"✓ 已保存",
"Voice on":"语音：开","Voice off":"语音：关","Gestures on":"手势：开","Gestures off":"手势：关",
"Not configured yet":"尚未配置","02 / BLUETOOTH CONNECTION":"02 / 蓝牙连接",
"Finding demo device…":"正在寻找演示设备……","Ready to pair.":"准备配对。",
"For the physical product, turn on Bluetooth in your phone or computer settings and put SCALP360 in pairing mode.":"如使用实体产品，请在手机或电脑设置中打开蓝牙，并将 SCALP360 置于配对模式。",
"Prototype pairing only. This website cannot turn on your system Bluetooth or control a physical SCALP360. Device protocol integration is not available.":"仅为原型配对演示。本网站无法打开系统蓝牙，也无法控制实体 SCALP360。设备协议集成暂不可用。",
"✓ Connected in this demo · Your saved mappings are ready.":"✓ 演示中已连接 · 你保存的映射已就绪。",
"Simulating discovery and pairing…":"正在模拟发现与配对……","Not connected":"未连接","Connecting…":"连接中……",
"Connect demo device":"连接演示设备","Disconnect demo":"断开演示设备",
"Return to paused care":"返回已暂停的护理","Continue to positioning":"继续佩戴确认",
"Mappings stay saved. Connection is checked again when you return. Bluetooth is for nearby use; remote family care follows its separate on-site readiness flow.":"映射会一直保存，返回时会再次检查连接。蓝牙用于近距离使用；远程家人护理遵循独立的现场就绪流程。",
"Command Settings":"指令设置","Device Connection":"设备连接","Controls & Device":"控制与设备",
"Ⅱ Paused · no demo progression":"Ⅱ 已暂停 · 演示未推进","Running · saved command mappings active":"运行中 · 已保存的指令映射生效",
"Connection lost. Reconnect before resuming.":"连接已断开，恢复前请重新连接。",
"Resume":"继续","Pause":"暂停",
"Map controls to care.":"把控制映射到护理。",
"Choose recommended phrases and gestures, or assign your own to Start, Stop, Pause, Resume, Status, Gentler Massage and Cool Drying.":"选择推荐的短语和手势，或为开始、停止、暂停、继续、状态、更轻柔按摩和凉风吹干指定你自己的指令。",
"First · Configure and test":"第一步 · 配置并测试","Each command is linked to one specific function. Save your choices.":"每条指令都对应一个具体功能。保存你的选择。",
"Then · Connect via Bluetooth":"第二步 · 通过蓝牙连接","Pair the device before positioning and starting care. Pairing in this prototype is simulated.":"在佩戴和开始护理之前，先配对设备。此原型中的配对为模拟。",
"Configure my commands":"配置我的指令","Next: command mappings → device connection → positioning.":"接下来：指令映射 → 设备连接 → 佩戴确认。",
// onboarding guide
"Welcome":"欢迎","Zones":"分区","Hands-free":"免手操作","Remote":"远程","Display":"显示","Ready":"就绪",
"A little guidance.":"一点小指引。","A more personal routine.":"一段更个人化的护理流程。",
"Discover what each control does, then choose how you want to care. You can change these preferences at any time.":"了解每个控制的功能，然后选择你想要的护理方式。这些偏好随时可以更改。",
"01 · Make it personal":"01 · 个人定制","Set care by scalp region and hair length.":"按头皮区域和头发长度设置护理。",
"02 · Choose your controls":"02 · 选择控制方式","Touch, voice, gestures or authorised remote care.":"触控、语音、手势或经授权的远程护理。",
"03 · Get comfortably ready":"03 · 舒适就位","Confirm your positioning before every session.":"每次护理前确认佩戴就位。",
"Interactive concept: no physical device is connected.":"交互概念演示：未连接实体设备。",
"Different areas.":"不同区域。","Different needs.":"不同需求。",
"Use":"使用","on Home. Choose a function, select one or more zones, then adjust only those areas.":"（位于首页）。选择一个功能，选中一个或多个分区，然后只调整这些区域。",
"Scalp · A1–A9":"头皮 · A1–A9","Front / crown / rear":"前 / 顶 / 后","Left / centre / right — your perspective":"左 / 中 / 右 —— 以你的视角",
"Lengths · B1–B3":"发段 · B1–B3","B1 · Upper lengths":"B1 · 上段","B2 · Mid-lengths":"B2 · 中段","B3 · Ends":"B3 · 发梢",
"Conditioner is assigned to hair lengths.":"护发素作用于发段。",
"Wash, massage, conditioner, drying and optional red light each have their own settings. A checkmark and outline identify selected zones.":"清洗、按摩、护发素、吹干和可选红光各有独立设置。对勾和描边标识已选分区。",
"Control that fits you.":"适合你的控制方式。",
"These shortcuts stay on Home and Live Care after setup. Enabling a method never starts a session.":"设置完成后，这些快捷方式会保留在首页和实时护理页。开启某种控制方式不会自动开始护理。",
"Enable voice control":"开启语音控制",
"Voice control → Tap to speak":"语音控制 → 点击说话",
". Say “Start care”, “Stop care” or “What stage is it?”. Microphone permission is requested only when you tap to speak.":"。说 “Start care”、“Stop care” 或 “What stage is it?”。仅在你点击说话时，才会请求麦克风权限。",
"Enable gesture control":"开启手势控制",
"to try recognised start and stop gestures. This demo uses simulation buttons; it does not track your camera.":"来体验已识别的开始/停止手势。本演示使用模拟按钮，不会追踪你的摄像头。",
"Touch controls remain available.":"触控操作始终可用。","on Live Care whenever you need to end the session.":"在实时护理页，随时可以结束会话。",
"Care from a distance.":"远距离的护理。",
"The permanent":"常驻的","navigation entry takes you back to your family profile at any time.":"导航入口，让你随时回到家人档案。",
"Choose the authorised family member.":"选择已授权的家人。","Select their routine and zone settings.":"选择对方的护理流程和分区设置。","Wait for fresh on-site positioning confirmation.":"等待现场重新确认佩戴就位。","Start remotely and follow Live Care.":"远程开始，并在实时护理中跟进。",
"Remote care never bypasses the person on site. The current family profile and readiness confirmation are simulated.":"远程护理绝不会绕过现场人员。当前的家人档案和就绪确认均为模拟。",
"Make every detail clear.":"让每个细节都清晰。","Choose your display now.":"现在选择你的显示偏好。","Reopen":"重新打开","in the header whenever you need it.":"（顶栏入口，随时可用）。",
"Night":"夜间","Day":"日间","Match my device":"跟随我的设备",
"Checks, outlines, patterns and labels explain states without relying on colour alone.":"对勾、描边、图案和标签共同说明状态，不仅依靠颜色。",
"You know your way.":"你已经熟悉操作了。",
"Your preferences are saved in this browser. Next, confirm your physical positioning, add hair details and review your care plan.":"你的偏好已保存在此浏览器中。接下来，请确认佩戴就位、补充头发信息并查看护理方案。",
"Fit check → hair & scalp information → care plan → review → start.":"佩戴检查 → 头发与头皮信息 → 护理方案 → 确认 → 开始。",
"Return to your preferences and saved care history. Demo suggestions use your answers, not medical image analysis.":"返回你的偏好和已保存的护理历史。演示建议基于你的回答，而非医学图像分析。",
"Replay this introduction or jump directly to any feature.":"重看本引导，或直接跳转到任一功能。",
"L PRO / FIRST-TIME SETUP":"L PRO / 首次设置","Save & skip":"保存并跳过","Back":"上一步",
"Explore Home":"去首页逛逛","Begin positioning":"开始佩戴确认","Show me around":"带我看看",
"HELP & GUIDE":"帮助与引导","Help & Guide":"帮助与引导","Find your next step.":"找到你的下一步。",
"Replay the introduction or go straight to a feature.":"重看引导，或直达某个功能。",
"Replay setup guide":"重看设置引导","Resume setup guide":"继续设置引导",
"Zone care":"分区护理","Choose scalp or length areas and tune each function.":"选择头皮或发段区域，并调整每项功能。",
"Enable, speak and check the current care stage.":"开启语音、说话并查询当前护理阶段。",
"Explore recognised-gesture simulations.":"体验已识别手势的模拟。",
"Choose a family member and request on-site readiness.":"选择家人并发起现场就绪请求。",
"Day, night and accessibility preferences.":"日间、夜间与无障碍偏好。",
"New to L Pro?":"初次使用 L Pro？","Understand your zones and controls before your first session.":"在第一次护理前，先了解你的分区和控制方式。","Continue setup":"继续初始设置",
"Setup steps":"设置步骤",
"Woman comfortably positioned in the L Pro head care chamber":"女性舒适地位于 L Pro 头部护理舱中",
// camera cursor (gesture-cursor.js)
"CAMERA CURSOR":"摄像头光标","No mouse needed.":"不必使用鼠标。",
"Your index finger becomes the cursor. Pinch to click, or use dwell mode. Move to the screen's top or bottom edge to scroll. Video is processed on this device only — nothing is recorded or uploaded.":"食指就是你的光标。捏合即代表点击，也可以使用悬停模式。把光标移到屏幕上、下边缘即可滚动页面。视频只在本设备上处理——不会被录制或上传。",
"Scroll up":"向上滚动","Scroll down":"向下滚动",
"Turn on camera cursor":"开启摄像头光标","Turn off camera cursor":"关闭摄像头光标","Stop camera cursor":"关闭摄像头光标",
"Dwell click — hold steady over a target instead of pinching":"悬停点击——对准目标稳定停留即可，无需捏合",
"The gesture buttons above are simulations. The optional camera cursor runs entirely on this device.":"上方的手势按钮为模拟演示。可选的摄像头光标完全在本设备上运行。",
"Camera unavailable. Use touch controls instead.":"摄像头不可用。请改用触控操作。",
"Camera needs a secure connection. Open this page via localhost or https.":"摄像头需要安全连接。请通过 localhost 或 https 打开本页。",
"Requesting camera…":"正在请求摄像头……","Loading hand tracking…":"正在加载手势识别……",
"Camera permission denied. Allow it in the browser address bar, or use touch controls.":"摄像头权限被拒绝。请在浏览器地址栏中允许，或改用触控操作。",
"Loading the hand model needs an internet connection.":"加载手势模型需要网络连接。",
"Camera cursor stopped.":"摄像头光标已关闭。",
"Pinch to click · Esc to exit":"捏合=点击 · 按 Esc 退出","Dwell click · Esc to exit":"悬停=点击 · 按 Esc 退出",
"Show your hand to the camera.":"请把手伸到摄像头前。"
};
// Phrases with dynamic numbers/values that plain dictionary keys cannot cover.
var SPECIALS=[
{re:/\bStep (\d+) of (\d+)\. Relax\. Your selected care is in progress\./g,fn:function(m,a,b){return '第 '+a+' 步 / 共 '+b+' 步。放轻松，你选择的护理正在进行。'}},
{re:/\b(\d+) ZONES SELECTED\b/g,fn:function(m,n){return '已选 '+n+' 个分区'}},
{re:/\/ (\w+) temperature/g,fn:function(m,v){return ' / '+({Cool:'凉风',Low:'低温',Standard:'标准'}[v]||v)}}
];
function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
// Longest keys first so "Long Hair Care" wins over "Long"; \b only on word-char edges
// so keys like "✓ Demo device connected" or "← Home" still match.
var RULES=Object.keys(MAP).sort(function(a,b){return b.length-a.length}).map(function(k){
var pat=(/\w/.test(k[0])?'\\b':'')+escRe(k)+(/\w/.test(k[k.length-1])?'\\b':'');
return [new RegExp(pat,'g'),MAP[k]]});
function tr(s){if(!s)return s;var out=s,i,m;
for(i=0;i<SPECIALS.length;i++){out=out.replace(SPECIALS[i].re,SPECIALS[i].fn)}
for(i=0;i<RULES.length;i++){m=out.replace(RULES[i][0],RULES[i][1]);if(m!==out)out=m}
return out===s?s:out}
function walk(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,p,v,t;
while(n=w.nextNode()){p=n.parentNode;if(!p||p.nodeName==='SCRIPT'||p.nodeName==='STYLE')continue;
v=n.nodeValue;if(!v||!v.trim())continue;t=tr(v);if(t!==v)n.nodeValue=t}}
function attrsPass(root){var els=root.querySelectorAll('[placeholder],[aria-label],[title],[alt]');
els.forEach===undefined||els.forEach(function(el){['placeholder','aria-label','title','alt'].forEach(function(a){
var v=el.getAttribute(a);if(!v)return;var t=tr(v);if(t!==v)el.setAttribute(a,t)})})}
function applyI18n(){walk(document.documentElement);attrsPass(document.documentElement)}
// Browser alert/confirm bypass the DOM; translate through the same dictionary.
var _alert=window.alert,_confirm=window.confirm;
window.alert=function(s){_alert(tr(String(s)))};
window.confirm=function(s){return _confirm(tr(String(s)))};
var lang=localStorage.getItem('lpro-lang')||'en';
// In Chinese mode, fresh users get Chinese recommended command phrases so the
// voice/gesture demo works end-to-end; existing saved mappings are respected.
if(lang==='zh'&&!saved.commands&&typeof careActions!=='undefined'){
var ZH_CMDS={start:['开始护理','竖起大拇指'],stop:['停止护理','摊开手掌'],pause:['暂停护理','握拳'],resume:['继续护理','伸出两指'],status:['现在哪一步','向上指'],gentle:['按摩轻一点','向下滑动'],cool:['凉风吹干','向左滑动']};
careActions.forEach(function(a){var p=ZH_CMDS[a[0]];if(p){a[2]=p[0];a[3]=p[1]}});
if(typeof mappings!=='undefined'&&typeof recommendedMappings==='function')mappings=recommendedMappings();
// A draft cloned during the load-time render predates the swap — refresh it too.
if(typeof draftCommands!=='undefined'&&draftCommands)draftCommands=structuredClone(mappings);
if((location.hash.slice(1)||'home')==='commands'&&typeof render==='function')render()}
window.toggleLang=function(){localStorage.setItem('lpro-lang',lang==='en'?'zh':'en');location.reload()};
var btn=document.getElementById('lang-toggle');
if(btn){btn.textContent=lang==='zh'?'EN':'中文';btn.title=lang==='zh'?'Switch to English':'切换到中文'}
document.documentElement.lang=lang==='zh'?'zh-CN':'en';
if(lang==='zh')applyI18n();
// Re-translate whenever the app re-renders anything (routes, modals, status text).
// English mode never translates — the dictionary only runs in Chinese mode.
var scheduled=false;
new MutationObserver(function(){if(lang!=='zh'||scheduled)return;scheduled=true;
requestAnimationFrame(function(){scheduled=false;applyI18n()})})
.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
})();
