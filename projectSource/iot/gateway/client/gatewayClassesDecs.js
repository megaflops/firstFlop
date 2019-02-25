var mqtt=require('../../../mqtt/client/node_modules/mqtt');
var fs=require('fs');
var log=require('./trace');
var config=require("./config");
var LOG_TAG="GW_CLASS"

function subscribeMessages(config){
	var subscribeMessageReset=config.reset;
	var subscribeMessageStatus=config.status;
	var subscribeMessageRegister=config.register;
	var subscribeMessageRegisterAcc=config.registrationAcceptedSubs;
	var subscribeMessageAction=config.action=config.action;
	//this.subscribeMessageStatus="/+/+/STATUS"; why this wont work here
	//even if I return this.subscribeMessageRegister
	function status() {
		log.Info(LOG_TAG,"Sub Status " +subscribeMessageStatus);
		return subscribeMessageStatus;
	}
	function reset() {
		log.Info(LOG_TAG,"Sub Reset " +subscribeMessageStatus);
		return subscribeMessageReset;
	}
	function register() {
		log.Info(LOG_TAG,"Sub Regsiter " +subscribeMessageRegister);
		return subscribeMessageRegister;
	}
	function registerAcc() {
		log.Info(LOG_TAG,"Sub  RegsiterAcc " +subscribeMessageRegisterAcc);
		return subscribeMessageRegisterAcc;
	}
	function action() {
		log.Info(LOG_TAG,"Sub Action " +subscribeMessageAction);
		return subscribeMessageAction;
	}

	return {
		status: status,
		reset:reset,
		status:status,
		register: register,
		registerAcc:registerAcc,
		action:action
	}	

};
function publishMessages(config){
	var publishMessageRegister=config.register;
	var publishMessageDeRegister=config.deRegister;
	var publishMessageReset=config.reset;
	var publishMessageStatus=config.statusPublish;
	function register() {
		log.Info(LOG_TAG,"P Regsiter " +publishMessageRegister);
		return publishMessageRegister;
	}
	function deRegister() {
		log.Info(LOG_TAG,"P De Regsiter" +publishMessageDeRegister);
		return publishMessageDeRegister;
	}
	function reset() {
		log.Info(LOG_TAG,"P Reset " +publishMessageReset);
		return publishMessageReset;
	}
	function status() {
		log.Info(LOG_TAG,"P Status" +publishMessageStatus);
		return publishMessageStatus;
	}
	return {
		register: register,
		deRegister:deRegister,
		reset:reset,
		status:status
	}
}

function gateway(config) {
	this.deviceId=config.hwId;
	this.subDeviceId=config.myId;
	this.state=config.STATE_INIT;
	this.mqttBrokerState = config.STATE_INIT;
	this.mqttDeviceClientState = config.STATE_INIT;
	//this.mqttDeviceClient;
	//this.mqttCloudClient;
	this.mqttBroker;
	this.subscribeMessages;
	this.publishMessages;
	this.deviceNodes;
	this.numberDeviceNodes=0;
	this.subIdCount=0;
}

gateway.prototype.config = function(config) {
	this.subscribeMessages = subscribeMessages(config);
	this.publishMessages = publishMessages(config);
}

gateway.prototype.allocateDeviceNodesMemory = function(config) {
	this.deviceNodes=new Array (10);
}
gateway.prototype.localConnect = function(config) {
	log.Info(LOG_TAG,"Connecting " +config.localBrokerIp +config.qos +this.deviceId);
	this.mqttDeviceClient=mqtt.connect(config.localBrokerIp,
		             {clientId:config.myId,
		             keepalive:config.keepAlive,
    			     qos:config.qos,
    			     retain:config.retain	
    			    }   
			 );
}
gateway.prototype.cloudConnect = function(config){
	log.Info(LOG_TAG,"Connecting " +config.cloudBrokerIp +config.qos );
	this.mqttCloudClient=mqtt.connect(config.cloudBrokerIp,
		             {clientId:config.myId,
		             keepalive:config.keepAlive,
    			     qos:config.qos,
    			     retain:config.retain	
    			    }   
			 )
}
module.exports=gateway;
//exports.gateway=gateway

/*
function gateway(config) {
	this.devceId=config.hwId;
	this.subDeviceId=config.myID;
	this.state=config.STATE_INIT;
	this.mqttBrokerState = config.STATE_INIT;
	this.mqttDeviceClientState = config.STATE_INIT;
	this.mqttDeviceClient;
	this.mqttBroker;
	this.subscribeMessages;
	this.publishMessages;
	this.deviceNodes;
	this.numberDeviceNodes=0;
};

gateway.prototype.config = function(config) {
	this.subscribeMessages = subscribeMessages(config);
	this.publishMessages = publishMessages(config);
}

gateway.prototype.allocateDeviceNodesMemory = function(config) {
	this.deviceNodes=new Array (10);
}
gateway.prototype.localConnect = function(config) {
	log.Info(LOG_TAG,"Connecting " +config.localBrokerIp +config.qos );
	this.mqttDeviceClient=mqtt.connect(config.localBrokerIp,
		             {clientId:config.myID,
		             keepalive:config.keepAlive,
    			     qos:config.qos,
    			     retain:config.retain	
    			    }   
			 );
}
gateway.prototype.cloudConnect = function(config){
	log.Info(LOG_TAG,"Connecting " +config.cloudBrokerIp +config.qos );
	this.mqttCloudClient=mqtt.connect(config.cloudBrokerIp,
		             {clientId:config.myID,
		             keepalive:config.keepAlive,
    			     qos:config.qos,
    			     retain:config.retain	
    			    }   
			 )
}*/

