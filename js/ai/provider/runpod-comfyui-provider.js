// RunPod ComfyUIプロバイダー: クラウド上のComfyUIに認証付きHTTPS接続
class RunPodComfyUIProvider extends AIProvider{
constructor(){
super('runpodComfyUI','RunPod');
}
getSupportedRoles(){
return[
AI_ROLES.Text2Image,
AI_ROLES.RemoveBG,
AI_ROLES.Upscaler,
AI_ROLES.Image2Image,
AI_ROLES.Inpaint,
AI_ROLES.I2I_Angle
];
}
needsApiKey(){
return true;
}
getApiKey(){
var el=$('runpodApiKey');
return el?el.value:'';
}
getEndpointUrl(){
return $('runpodComfyUIUrl').value;
}
async heartbeat(){
return comfyuiApiHeartbeat();
}
async executeT2I(layer,spinnerId){
return comfyuiHandleProcessQueue(layer,spinnerId,'T2I');
}
async executeI2I(layer,spinnerId){
return comfyuiHandleProcessQueue(layer,spinnerId,'I2I');
}
async executeRembg(layer,spinnerId){
return comfyuiHandleProcessQueue(layer,spinnerId,'Rembg');
}
async executeUpscale(layer,spinnerId){
return comfyuiHandleProcessQueue(layer,spinnerId,'Upscaler');
}
async executeInpaint(layer,spinnerId){
return comfyuiHandleProcessQueue(layer,spinnerId,'Inpaint');
}
async executeAngle(layer,spinnerId,anglePrompt){
return comfyuiHandleProcessQueue(layer,spinnerId,'I2I_Angle',{anglePrompt:anglePrompt});
}
async fetchDiffusionInformation(){
comfyuiFetchModels();
comfyuiFetchSampler();
comfyuiFetchUpscaler();
comfyuiVaeLoader();
comfyuiClipModels();
comfyuiFetchObjectInfoOnly();
}
}
