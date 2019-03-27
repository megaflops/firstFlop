var mqtt=require('../node_modules/mqtt');
var fs=require('fs');
var log=require('../common/trace');
var config=require("./deviceconfig");

function device(config){
	this.state = config.stateInit;
    this.deviceID=config.deviceID;
    this.deviceState=config.state;
    this.localBroker;
}

device.prototype.localBrokerConnect = function(config) {
	log.Info(LOG_TAG,"Connecting " +config.localBrokerIp +config.deviceID);
	this.mqttDeviceClient=mqtt.connect(config.localBrokerIp,
		             {clientId:config.deviceID,
		             keepalive:config.keepAlive,
    			     qos:config.qos,
    			     retain:config.retain	
    			    }   
			 );
}
module.exports=device;
