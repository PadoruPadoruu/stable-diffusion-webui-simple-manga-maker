// AI進捗表示（スピナー、キュー待ち数、サンプリングステップ、キャンセルボタン）
var spinnerLogger=new SimpleLogger('spinner',LogLevel.DEBUG);

var aiProgressState={
spinners:{},
stepValue:0,
stepMax:0,
currentPromptId:null
};

function removeSpinner(spinnerId){
var target=aiProgressState.spinners[spinnerId];
if(target&&target.container){
target.container.remove();
delete aiProgressState.spinners[spinnerId];
}else{
var el=$(spinnerId);
if(el){
var parent=el.closest('.ai-progress-item');
if(parent){
parent.remove();
}else{
el.remove();
}
delete aiProgressState.spinners[spinnerId];
}
}
resetAiStepProgress();
updateAiProgressDisplay();
}

function createSpinner(index){
var container=createSpinnerContainer(index,'text-danger');
return container.spinnerEl;
}

function createSpinnerSuccess(index){
var container=createSpinnerContainer(index,'text-success');
return container.spinnerEl;
}

function createSpinnerContainer(index,colorClass){
var container=document.createElement('span');
container.className='ai-progress-item';
container.style.display='inline-flex';
container.style.alignItems='center';
container.style.marginLeft='2px';

var spinner=document.createElement('span');
spinner.id='spinner-'+index;
spinner.className='spinner-border '+colorClass+' ms-1 spinner-border-sm';

var cancelBtn=document.createElement('span');
cancelBtn.className='ai-cancel-btn';
cancelBtn.textContent='\u2715';
cancelBtn.style.cursor='pointer';
cancelBtn.style.marginLeft='1px';
cancelBtn.style.fontSize='9px';
cancelBtn.style.color='#ff6b6b';
cancelBtn.style.fontWeight='bold';
cancelBtn.title=getText('aiCancelTask');
cancelBtn.onclick=function(e){
e.stopPropagation();
cancelAiTask(spinner.id);
};

container.appendChild(spinner);
container.appendChild(cancelBtn);

var areaHeader=document.querySelector("#layer-panel .area-header");
areaHeader.appendChild(container);

aiProgressState.spinners[spinner.id]={
container:container,
spinnerEl:spinner,
cancelBtn:cancelBtn
};

updateAiProgressDisplay();
return{container:container,spinnerEl:spinner};
}

function updateAiProgressDisplay(){
var progressEl=document.getElementById('ai-progress-info');
var spinnerCount=Object.keys(aiProgressState.spinners).length;
if(spinnerCount===0){
if(progressEl){
progressEl.remove();
}
aiProgressState.stepValue=0;
aiProgressState.stepMax=0;
aiProgressState.currentPromptId=null;
return;
}

if(!progressEl){
progressEl=document.createElement('span');
progressEl.id='ai-progress-info';
progressEl.style.fontSize='10px';
progressEl.style.marginLeft='4px';
progressEl.style.color='var(--text-color-B)';
var areaHeader=document.querySelector("#layer-panel .area-header");
var firstSpinnerContainer=areaHeader.querySelector('.ai-progress-item');
if(firstSpinnerContainer){
areaHeader.insertBefore(progressEl,firstSpinnerContainer);
}else{
areaHeader.appendChild(progressEl);
}
}

var waitingCount=0;
if(typeof comfyuiQueue!=='undefined'){
waitingCount+=comfyuiQueue.getWaitingCount();
}
if(typeof sdQueue!=='undefined'){
waitingCount+=sdQueue.getWaitingCount();
}

var text='';
if(waitingCount>0){
text+='\u00d7'+waitingCount;
}
if(aiProgressState.stepMax>0){
if(text.length>0){
text+=' : ';
}
text+=aiProgressState.stepValue+'/'+aiProgressState.stepMax;
}
progressEl.textContent=text;
}

function updateAiStepProgress(value,max,promptId){
aiProgressState.stepValue=value;
aiProgressState.stepMax=max;
aiProgressState.currentPromptId=promptId;
updateAiProgressDisplay();
}

function resetAiStepProgress(){
aiProgressState.stepValue=0;
aiProgressState.stepMax=0;
aiProgressState.currentPromptId=null;
updateAiProgressDisplay();
}

function cancelAiTask(spinnerId){
spinnerLogger.debug("cancelAiTask: "+spinnerId);
if(typeof comfyuiQueue!=='undefined'&&aiProgressState.currentPromptId){
comfyuiCancelPrompt(aiProgressState.currentPromptId);
}
if(typeof comfyuiQueue!=='undefined'){
comfyuiQueue.clearQueue();
}
if(typeof sdQueue!=='undefined'){
sdQueue.clearQueue();
}
var keys=Object.keys(aiProgressState.spinners);
for(var i=0;i<keys.length;i++){
var entry=aiProgressState.spinners[keys[i]];
if(entry&&entry.container){
entry.container.remove();
}
}
aiProgressState.spinners={};
resetAiStepProgress();
updateAiProgressDisplay();
}
