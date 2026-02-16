// Role Assignmentモーダル: Role×プロバイダーのマトリクスUI
var roleAssignmentUI=(function(){
var raLogger=new SimpleLogger('roleAssignUI',LogLevel.DEBUG);
var PROVIDER_COLUMNS=[
{id:'default',labelKey:'roleDefault'},
{id:'localComfyUI',label:'ComfyUI'},
{id:'localSDWebUI',label:'WebUI'},
{id:'runpodComfyUI',label:'RunPod'},
{id:'runpodEndpoint',label:'Serverless'},
{id:'falai',label:'Fal.ai'}
];
var ROLE_ROWS=[
{role:AI_ROLES.Text2Image,label:'T2I'},
{role:AI_ROLES.Image2Image,label:'I2I'},
{role:AI_ROLES.Inpaint,label:'Inpaint'},
{role:AI_ROLES.Upscaler,label:'Upscale'},
{role:AI_ROLES.RemoveBG,label:'RemoveBG'},
{role:AI_ROLES.I2I_Angle,label:'Angle'}
];
var tempAssignments={};
function open(){
tempAssignments={};
ROLE_ROWS.forEach(function(row){
tempAssignments[row.role]=providerRegistry.getRoleAssignment(row.role);
});
buildMatrix();
$('roleAssignModal').style.display='';
}
function close(){
$('roleAssignModal').style.display='none';
}
function apply(){
ROLE_ROWS.forEach(function(row){
providerRegistry.setRoleAssignment(row.role,tempAssignments[row.role]);
});
close();
updateLayerPanel();
raLogger.info('Role assignments applied');
debouncedSettingsSave();
}
function buildMatrix(){
var tbody=$('roleMatrixBody');
tbody.innerHTML='';
ROLE_ROWS.forEach(function(row){
var tr=document.createElement('tr');
var tdLabel=document.createElement('td');
tdLabel.textContent=row.label;
tr.appendChild(tdLabel);
PROVIDER_COLUMNS.forEach(function(col){
var td=document.createElement('td');
var radio=document.createElement('input');
radio.type='radio';
radio.name='roleAssign_'+row.role;
radio.className='role-radio';
radio.value=col.id;
if(col.id==='default'){
radio.checked=(tempAssignments[row.role]==='default');
}else{
var provider=providerRegistry.get(col.id);
if(!provider||!provider.supportsRole(row.role)){
radio.disabled=true;
td.className='role-provider-unavailable';
}
radio.checked=(tempAssignments[row.role]===col.id);
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
apply:apply
};
})();
