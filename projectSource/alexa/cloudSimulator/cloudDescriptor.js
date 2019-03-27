var mqtt=require('../node_modules/mqtt');
var fs=require('fs');
var log=require('./trace');
LOG_TAG_CLOUD_MQTT = "mqttcloud";

function cloud(config){
	this.state = config.stateInit;
	this.genID=0;
    this.cloudID=config.cloudID;
    this.cloudState=config.state;
	this.gatewayArray = [];
	this.gatewayCount=0;
}
cloud.prototype.connect = function(config,connectCB,errorCB,reConnecCB,messageCB){
	log.Info(LOG_TAG_CLOUD_MQTT,"Connecting " +config.cloudBrokerIp +config.cloudID);
	this.mqttClient=mqtt.connect(config.cloudBrokerIp,
		{clientId:config.cloudID,
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
cloud.prototype.subscribe= function (subsScription){
	this.mqttClient.subscribe(subsScription);
}
cloud.prototype.publish= function (topic,payload,option){
	this.mqttClient.publish(topic,payload,option);
}
module.exports=cloud;
