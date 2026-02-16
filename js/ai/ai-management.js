// AI機能の中央ルーター: プロバイダーレジストリ経由でディスパッチ
const sdQueue=new TaskQueue(1);
const comfyuiQueue=new TaskQueue(1);
const runpodEndpointQueue=new TaskQueue(1);
const falaiQueue=new TaskQueue(1);

var firstSDConnection=true;
var firstComfyConnection=true;

$('sdWebUIPageUrlDefaultUrl').addEventListener('click',(event)=>{
event.stopPropagation();
const defaultUrl='http://127.0.0.1:7860';
$('sdWebUIPageUrl').value=defaultUrl;
});

$('comfyUIPageUrlDefaultUrl').addEventListener('click',(event)=>{
event.stopPropagation();
const defaultUrl='http://127.0.0.1:8188';
$('comfyUIPageUrl').value=defaultUrl;
});




function existsWaitQueue() {
const sdQueueStatus=sdQueue.getStatus();
if(sdQueueStatus.total>0){
return true;
}

const comfyuiQueueStatus=comfyuiQueue.getStatus();
if(comfyuiQueueStatus.total>0){
return true;
}
const rpQueueStatus=runpodEndpointQueue.getStatus();
if(rpQueueStatus.total>0){
return true;
}
const falQueueStatus=falaiQueue.getStatus();
if(falQueueStatus.total>0){
return true;
}
return false;
}

function clearAllQueues() {
const sdCleared=sdQueue.clearQueue();
const comfyCleared=comfyuiQueue.clearQueue();
const rpCleared=runpodEndpointQueue.clearQueue();
const falCleared=falaiQueue.clearQueue();
logger.info(`All queues cleared: SD=${sdCleared}, ComfyUI=${comfyCleared}, RP=${rpCleared}, Fal=${falCleared}`);
return sdCleared+comfyCleared+rpCleared+falCleared;
}


async function T2I(layer,spinner){
var provider=providerRegistry.getProviderForRole(AI_ROLES.Text2Image);
if(provider){
return provider.executeT2I(layer,spinner.id);
}
}
function I2I(layer,spinner){
var provider=providerRegistry.getProviderForRole(AI_ROLES.Image2Image);
if(provider){
return provider.executeI2I(layer,spinner.id);
}
}

async function aiRembg(layer,spinner){
var provider=providerRegistry.getProviderForRole(AI_ROLES.RemoveBG);
if(provider){
return provider.executeRembg(layer,spinner.id);
}
}

async function aiUpscale(layer,spinner){
var provider=providerRegistry.getProviderForRole(AI_ROLES.Upscaler);
if(provider){
return provider.executeUpscale(layer,spinner.id);
}
}

function canUseInpaint(){
var provider=providerRegistry.getProviderForRole(AI_ROLES.Inpaint);
return provider!==null&&provider.canUseInpaint();
}

function canUseAngle(){
var provider=providerRegistry.getProviderForRole(AI_ROLES.I2I_Angle);
return provider!==null&&provider.canUseAngle();
}

function AngleGenerate(layer,spinner,anglePrompt){
var provider=providerRegistry.getProviderForRole(AI_ROLES.I2I_Angle);
if(provider){
return provider.executeAngle(layer,spinner.id,anglePrompt);
}
}


function getDiffusionInformation() {
var provider=providerRegistry.getActive();
if(provider){
provider.fetchDiffusionInformation();
}
}


function apiHeartbeat(){

logger.trace("apiHeartbeat");

const pingCheck=$('apiHeartbeatCheckbox');
if (pingCheck.checked) {
} else {
return;
}

var provider=providerRegistry.getActive();
if(provider){
provider.heartbeat();
}

const label=$('ExternalService_Heartbeat_Label');
let announce=$('checSD_WebUI_Announce');
if(label.style.color==='green') {
announce.style.display='none';
}
}


function updateUpscalerDropdown(models) {
const modelDropdown=$('text2img_hr_upscaler');
modelDropdown.innerHTML='';
models.forEach(model=>{
const option=document.createElement('option');
option.value=model.name;
option.textContent=model.name;

if (basePrompt.text2img_hr_upscaler===model.name) {
option.selected=true;
}
modelDropdown.appendChild(option);
});
}

function updateSamplerDropdown(models) {
const modelDropdown=$('basePrompt_samplingMethod');
modelDropdown.innerHTML='';
basePrompt.text2img_samplingMethod

models.forEach(model=>{
const option=document.createElement('option');
option.value=model.name;
option.textContent=model.name;

if (basePrompt.text2img_samplingMethod===model.name) {
option.selected=true;
}
modelDropdown.appendChild(option);
});
}

function updateModelDropdown(models) {
const modelDropdown=$('basePrompt_model');
modelDropdown.innerHTML='';
models.forEach(model=>{
const option=document.createElement('option');
option.value=model.title;
option.textContent=model.model_name;

if (basePrompt.text2img_model===removeHashStr(model.title)) {
option.selected=true;
}
modelDropdown.appendChild(option);
});
}

function updateVaeDropdown(models) {
const dropdown=$('vaeDropdownId');
dropdown.innerHTML='';
models.forEach(model=>{
logger.trace("updateVaeDropdown push ",model.name)
const option=document.createElement('option');
option.value=model.name;
option.textContent=model.name;
dropdown.appendChild(option);
});
}


//Before:ABC.safetensors [23e4fa2b6f]
//After :ABC.safetensors
function removeHashStr(str) {
return str.replace(/\s*\[[^\]]+\]\s*$/,'');
}

$('basePrompt_model').addEventListener('change',function(event){
if (apiMode==apis.A1111) {
sendModelToServer();
}else if(apiMode==apis.COMFYUI){
//TODO
}
});

$('clipDropdownId').addEventListener('change',function(event){
if (apiMode==apis.A1111) {
sendClipToServer();
}else if(apiMode==apis.COMFYUI){
//TODO
}
});
