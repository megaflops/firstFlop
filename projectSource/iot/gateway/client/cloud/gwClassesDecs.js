function gwConnection(types,config){
	this.deviceId=types[config.gwIdIndex];
	this.subDeviceId=types[config.gwSubIdIndex];
	this.deviceType=types[config.gwTypeIndex];
	this.state=0;
	this.lastSyncTime=0;
	this.pingTimer=null;
	this.pingTimeoutValue=0;
	//this.subscribeMessages;
	//this.publishMessages;
	this.numSubscribeMessages=0;
	this.numPublishMessages=0;
	this.SubStatusIndex=0;
	this.SubDeRegisterIndex=1;
	this.RegAcceptIndex=0;
	this.RegActionIndex=1;
	this.RegStatusIndex=2;
	this.numEndDevice=0;
}
gwConnection.prototype.config = function(){
	this.publishMessages= new Array(10);
	this.subscribeMessages = new Array(10);
	this.endDeviceList = new Array(10);
}
module.exports=gwConnection;
