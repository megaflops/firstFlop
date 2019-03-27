var mqtt=require('../../node_modules/mqtt');
var fs=require('fs');
var log=require('../../common/trace');
LOG_TAG_MQTT = "mqttCommon";

function gateway(config){
	this.state = config.stateInit;
	this.genID=0;
    this.gatewayID=config.gatewayID;
    this.gatewayState=config.stateInit;
    this.localBroker;
	this.cloudBroker;
	this.deviceArray = [];
	this.deviceCount=0;
}

gateway.prototype.connect = function(config,broker,connectCB,errorCB,reConnecCB,messageCB){
	var brokerip;
	if(broker == "local")
		brokerip = config.localBrokerIp;
	else
		brokerip = config.cloudBrokerIp;
	var id = config.gatewayID+broker;
	log.Info(LOG_TAG_MQTT,"Connecting " +brokerip +id);
	this.mqttClient=mqtt.connect(brokerip,
		{clientId:id,
		keepalive:config.keepAlive,
		qos:config.qos,
		retain:config.retain	
	   }   
	)
	this.mqttClient.on("connect",connectCB);
	this.mqttClient.on("error",errorCB);
	this.mqttClient.on("reconnect",reConnecCB);
	this.mqttClient.on("message",messageCB);
}
gateway.prototype.subscribe= function (subsScription){
	this.mqttClient.subscribe(subsScription);
}
gateway.prototype.publish= function (topic,payload,option){
	this.mqttClient.publish(topic,payload,option);
}
module.exports=gateway;
