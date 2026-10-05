L Pro / SCALP360 — Website demo source

最新版完整静态网站源码（2026-10-04）。无需 npm 或编译。

运行：
1. 解压 ZIP，进入 L-Pro-Website 文件夹。
2. 可以直接打开 index.html 浏览；建议通过本地服务器运行以使用浏览器功能：
   python3 -m http.server 8000
3. 打开 http://localhost:8000
   或在 VS Code 使用 Live Server。

文件说明：
index.html — 页面入口与脚本加载顺序
style.css — 全部样式、日夜模式与响应式布局
app.js — 基础护理流程、个人记录、远程护理演示
upgrade.js — 9个头皮区与3个长发区、显示与无障碍设置
onboarding.js — 首次使用引导
command-model.js — 推荐语音/手势映射与验证逻辑
command-controls.js — 自定义命令、功能联动、模拟蓝牙连接
assets/ — 图片资源（含早期页面保留资源）

部署：将整个文件夹内容上传到支持静态网站的托管服务。
保留脚本加载顺序和相对路径。Google Fonts 的 Poppins 需要联网加载。

这是交互概念原型：蓝牙、设备控制、手势识别和家属远程护理均为模拟。
浏览器语音识别视浏览器支持和麦克风权限而定。
偏好及护理记录只存储在浏览器 localStorage；上传图片仅保留在当前页面内存。
不包含后台、账号系统、设备通信协议或医疗头皮分析。
不含任何部署凭证、Git历史或个人护理数据。
