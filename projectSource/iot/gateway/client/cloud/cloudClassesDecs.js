var mqtt=require('../../../../mqtt/client/node_modules/mqtt');
//var config=require("./config");
var fs=require('fs');
var log=require('../trace');
var LOG_TAG="GW_CLASS"

function subscribeMessages(config){
	var subscribeMessageRegister=config.register;
	var subscribeMessageDeRegister=config.deRegister;
	var subscribeMessageStatus=config.status;
	var subscribeMessageReset=config.reset;
	var subscribeMessageAction=config.action;
	//this.subscribeMessageStatus="/+/+/STATUS"; why this wont work here
	//even if I return this.subscribeMessageRegister
	function register() {
		log.Info(LOG_TAG,"Regsiter " +subscribeMessageRegister);
		return subscribeMessageRegister;
	}
	function deRegister() {
		log.Info(LOG_TAG,"Subs De Regsiter" +subscribeMessageDeRegister);
		return subscribeMessageDeRegister;
	}
	function status() {
		log.Info(LOG_TAG,"Subs Status " +subscribeMessageStatus);
		return subscribeMessageStatus;
	}
	function reset() {
		log.Info(LOG_TAG,"Subs Reset " +subscribeMessageReset);
		return subscribeMessageReset;
	}
	function action() {
		log.Info(LOG_TAG,"Sub Action " +subscribeMessageAction);
		return subscribeMessageAction;
	}

	return {
		register: register,
		deRegister:deRegister,
		status:status,
		reset:reset,
		action:action
	}	

};
function publishMessages(config){
	var publishMessageRegister=config.register;
	var publishMessageDeRegister=config.DeRegister;
	var publishMessageReset=config.reset;
	var publishMessageAction=config.action;
	var publishMessageStatus=config.status;

	function action() {
		log.Info(LOG_TAG,"R Action " +subscribeMessageAction);
		return publishMessageAction;
	}
	function register() {
		log.Info(LOG_TAG,"R Regsiter " +subscribeMessageRegister);
		return publishMessageRegister;
	}
	function deRegister() {
		log.Info(LOG_TAG,"R DeRegsiter" +subscribeMessageDeRegister);
		return publishMessageDeRegister;
	}
	function reset() {
		log.Info(LOG_TAG,"R Reset " +publishMessageReset);
		return publishMessageReset;
	}
	function status() {
		log.Info(LOG_TAG,"R Status " +publishMessageStatus);
		return publishMessageStatus;
	}
	return {
		reset: reset,
		register:register,
		deRegister:deRegister,
		action:action,
		status:status
	}
}

function cloudComp(config) {
	this.devceId=config.hwId;
	this.subDeviceId=config.myID;
	this.state=config.STATE_INIT;
	this.mqttBrokerState = config.STATE_INIT;
	this.mqttDeviceClientState = config.STATE_INIT;
	this.mqttBroker;
	this.subscribeMessages;
	this.publishMessages;
	this.numberGwNodes=0;
};

cloudComp.prototype.config = function(config) {
	this.subscribeMessages = subscribeMessages(config);
	this.publishMessages = publishMessages(config);
}

cloudComp.prototype.allocateGatewayNodesMemory = function(config) {
	this.gwNodes=new Array (10);
}

cloudComp.prototype.cloudConnect = function(config){
	log.Info(LOG_TAG,"Connecting " +config.cloudBrokerIp +config.qos );
	this.mqttCloudClient=mqtt.connect(config.cloudBrokerIp,
		             {clientId:config.myID,
		             keepalive:config.keepAlive,
    			     qos:config.qos,
    			     retain:config.retain	
    			    }   
			 )
}
module.exports=cloudComp;


