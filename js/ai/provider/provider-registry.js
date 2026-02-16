// プロバイダーレジストリ: プロバイダー登録とRole→プロバイダーのルーティング管理
var providerRegistry=(function(){
var providers={};
var activeProviderId=null;
var apiModeToProviderId={};
var registryLogger=new SimpleLogger('providerRegistry',LogLevel.DEBUG);
function register(provider){
providers[provider.id]=provider;
registryLogger.debug('Registered provider: '+provider.id);
}
function get(id){
return providers[id]||null;
}
function getAll(){
return Object.values(providers);
}
function mapApiMode(apiModeValue,providerId){
apiModeToProviderId[apiModeValue]=providerId;
}
function syncFromApiMode(apiModeValue){
var id=apiModeToProviderId[apiModeValue];
if(id){
setActive(id);
return true;
}
registryLogger.debug('No provider mapped for apiMode: '+apiModeValue);
return false;
}
function setActive(id){
if(!providers[id]){
registryLogger.error('Provider not found: '+id);
return false;
}
activeProviderId=id;
registryLogger.info('Active provider: '+id);
return true;
}
function getActive(){
if(!activeProviderId)return null;
return providers[activeProviderId]||null;
}
function getActiveId(){
return activeProviderId;
}
function getProviderForRole(role){
var active=getActive();
if(active&&active.supportsRole(role)){
return active;
}
return null;
}
return{
register:register,
get:get,
getAll:getAll,
mapApiMode:mapApiMode,
syncFromApiMode:syncFromApiMode,
setActive:setActive,
getActive:getActive,
getActiveId:getActiveId,
getProviderForRole:getProviderForRole
};
})();
