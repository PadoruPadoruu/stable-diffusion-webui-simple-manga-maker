// 統合設定ウインドウ: 使用サービス・接続先・ComfyUI Workflowの統合管理
var unifiedSettingsWindow=(function(){
var usLogger=new SimpleLogger('unifiedSettings',LogLevel.DEBUG);
var overlayEl=null;
var workflowInitialized=false;
function open(){
if(!overlayEl)overlayEl=$('unifiedSettingsOverlay');
overlayEl.classList.add('active');
roleAssignmentUI.buildMatrix();
switchTab(0);
var falaiProvider=providerRegistry.get('falai');
if(falaiProvider&&falaiProvider.getApiKey()){
falaiProvider.fetchModelsIfNeeded();
}
}
function close(){
if(!overlayEl)return;
overlayEl.classList.remove('active');
}
function apply(){
close();
}
function switchTab(idx){
var tabs=overlayEl.querySelectorAll('.us-tab');
var contents=overlayEl.querySelectorAll('.us-tab-content');
tabs.forEach(function(t,i){
t.classList.toggle('active',i===idx);
});
contents.forEach(function(c,i){
c.classList.toggle('active',i===idx);
});
if(idx===1&&!workflowInitialized){
initWorkflowTab();
}
}
function initWorkflowTab(){
workflowInitialized=true;
var container=$('usWorkflowContainer');
if(!comfyUIWorkflowWindow){
comfyUIWorkflowWindow=new ComfyUIWorkflowWindow();
}
comfyUIWorkflowWindow.initializeInContainer(container);
if(!comfyUIWorkflowEditor){
comfyUIWorkflowEditor=new ComfyUIWorkflowEditor();
comfyUIWorkflowEditor.initialize();
comfyui_monitorConnection_v2();
}
setTimeout(function(){
if(typeof ComfyUIGuide!=='undefined'){
comfyui_apiHeartbeat_v2().then(function(isOnline){
ComfyUIGuide.showSetupGuide(isOnline);
});
}
},300);
}
return{
open:open,
close:close,
apply:apply,
switchTab:switchTab
};
})();
