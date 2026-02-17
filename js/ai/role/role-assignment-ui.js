// Role Assignment: Role×プロバイダーのマトリクスUI
var roleAssignmentUI=(function(){
var raLogger=new SimpleLogger('roleAssignUI',LogLevel.DEBUG);
var PROVIDER_COLUMNS=[
{id:'localComfyUI',label:'ComfyUI'},
{id:'localSDWebUI',label:'SD WebUI'},
{id:'runpodComfyUI',label:'RunPod ComfyUI'},
{id:'runpodEndpoint',label:'RunPod Serverless'},
{id:'falai',label:'Fal.ai'}
];
var ROLE_ROWS=[
{role:AI_ROLES.Text2Image,labelKey:'roleText2Image'},
{role:AI_ROLES.Image2Image,labelKey:'roleImage2Image'},
{role:AI_ROLES.Inpaint,labelKey:'roleInpaint'},
{role:AI_ROLES.Upscaler,labelKey:'roleUpscaler'},
{role:AI_ROLES.RemoveBG,labelKey:'roleRemoveBG'},
{role:AI_ROLES.I2I_Angle,labelKey:'roleAngle'}
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
tdLabel.textContent=i18next.t(row.labelKey);
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
