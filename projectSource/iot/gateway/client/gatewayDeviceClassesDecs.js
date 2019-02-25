function deviceConnection(types,config){
	//this.deviceId=types[1];
	this.subDeviceId=types[config.deviceSubIdIndex];
	this.deviceType=types[config.deviceTypeIndex];
	this.state=0;
	this.lastSyncTime=0;
	this.deviceNonPingable;// applicable for device who preodically wakes up
	                       // at huge time interval 7-8 hrs, reads/sends command
			       // and sleeps again
	this.pingTimer=null;
	this.pingTimeoutValue=0;
	this.subscribeMessages;
	this.publishMessages;
	this.numSubscribeMessages=0;
	this.numPublishMessages=0;
	this.subId=0;
}
deviceConnection.prototype.config = function(){
	this.publishMessages= new Array(10);
	this.subscribeMessages = new Array(10);
}
module.exports=deviceConnection;
