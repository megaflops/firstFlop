var mqtt=require('mqtt');

var fs = require('fs');
var localBrokerIp="mqtt://172.16.4.173/1883";
console.log('Connecitng to local Broker' +localBrokerIp);
var localClient = mqtt.connect(localBrokerIp);
		

//On connect: Subscribing to topic
localClient.on("connect",function(){	
	console.log("connected local broker " +localClient.connected);
	localClient.publish('myTopic', 'Hello mqtt');
	console.log('Message Sent');
})

localClient.on("error",function(error){
console.log("Can't connect to local broker" + error);
process.exit(1)})

