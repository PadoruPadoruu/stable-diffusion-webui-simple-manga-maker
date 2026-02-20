// Role Assignment: Role×プロバイダーのマトリクスUI
var roleAssignmentUI=(function(){
var PROVIDER_COLUMNS=[
{id:'localComfyUI',label:'ComfyUI (Local)'},
{id:'runpodComfyUI',label:'RunPod ComfyUI'},
{id:'localSDWebUI',label:'SD WebUI (A1111/Forge)'},
{id:'falai',label:'Fal.ai'}
];
var ROLE_ROWS=[
{role:AI_ROLES.Text2Image,labelKey:'roleText2Image'},
{role:AI_ROLES.Image2Image,labelKey:'roleImage2Image'},
{role:AI_ROLES.Inpaint,labelKey:'roleInpaint'},
{role:AI_ROLES.Upscaler,labelKey:'roleUpscaler'},
{role:AI_ROLES.RemoveBG,labelKey:'roleRemoveBG'},
{role:AI_ROLES.I2I_Angle,labelKey:'roleAngle'},
{role:AI_ROLES.Image2Prompt_CLIP,labelKey:'roleInterrogateCLIP'},
{role:AI_ROLES.Image2Prompt_DEEPDOORU,labelKey:'roleInterrogateDEEPDOORU'}
];
var tempAssignments={};
function open(){
unifiedSettingsWindow.open();
}
function close(){
unifiedSettingsWindow.close();
}
function applyAssignments(){
ROLE_ROWS.forEach(function(row){
providerRegistry.setRoleAssignment(row.role,tempAssignments[row.role]);
});
updateLayerPanel();
raLogger.info('Role assignments applied');
debouncedSettingsSave();
}
function buildMatrix(){
tempAssignments={};
ROLE_ROWS.forEach(function(row){
tempAssignments[row.role]=providerRegistry.getRoleAssignment(row.role);
});
var tbody=$('roleMatrixBody');
tbody.innerHTML='';
ROLE_ROWS.forEach(function(row){
var tr=document.createElement('tr');
var tdLabel=document.createElement('td');
tdLabel.setAttribute('data-i18n',row.labelKey);
tdLabel.innerHTML=i18next.t(row.labelKey);
tr.appendChild(tdLabel);
PROVIDER_COLUMNS.forEach(function(col){
var td=document.createElement('td');
var radio=document.createElement('input');
radio.type='radio';
radio.name='roleAssign_'+row.role;
radio.className='role-radio';
radio.value=col.id;
var provider=providerRegistry.get(col.id);
if(!provider||!provider.supportsRole(row.role)){
radio.disabled=true;
td.className='role-provider-unavailable';
}
var assigned=tempAssignments[row.role];
if(assigned==='default'||!assigned){
radio.checked=(col.id==='localComfyUI');
}else{
radio.checked=(assigned===col.id);
}
radio.addEventListener('change',function(){
if(this.checked){
tempAssignments[row.role]=col.id;
providerRegistry.setRoleAssignment(row.role,col.id);
updateWorkflowType();
updateLayerPanel();
debouncedSettingsSave();
apiHeartbeat();
}
});
td.appendChild(radio);
tr.appendChild(td);
});
tbody.appendChild(tr);
});
}
return{
open:open,
close:close,
apply:applyAssignments,
applyAssignments:applyAssignments,
buildMatrix:buildMatrix
};
})();
