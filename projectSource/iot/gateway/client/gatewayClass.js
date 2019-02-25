Class gateway{
	int gGuid;
	int mqttBrokerState;
	server mqttBroker;
	int    mqttDeviceClientState;
	client mqttDeviceClient;
	int mqttCloudClientState;
	client mqttCloudClient;
};

function gateway(var gateWayID) {
	this.gGuid=gateWayID;
	this.mqttBrokerState = GATEWAY_INIT;
	this.mqttDeviceClientState = GATEWAY_INIT;
	this.mqttCloudClientState  = GATEWAY_INIT;
	this.mqttDeviceClient=mqtt.connect(config.localBrokerIp,
		             {clientId:config.myID,
		             keepalive:config.keepAlive,
    			     qos:config.qos,
    			     retain:config.retain	
    			    }   
			 );
})


class publishMessages{
	//publish mesaages
	var publishmessageaction;
	var publishmessagestatus;
	var publishmessageshutdown;
	var publishmessagelogs;
	var publishmessageconfig;
}
class subscribeMessages {
	//Subscribe messages
	var subscribeMessageRegister;
	var subscribeMessageDeRegister;
	var subscribeMessageStatus;
}

class cloudConnectios{
	int cloudID;
	int state;
	int lastSyncTime
	publishMessages publish;
	subscribeMessages  sunscribe;
	client mqttCloudClient;
	client mqttCloudBroker;
}
Class deviceConnection{
	int deviceId;
	int subDeviceId;
	int deviceType;
	int state;
	int lastSyncTime;
	bool deviceNonPingable;// applicable for device who preodically wakes up
	                       // at huge time interval 7-8 hrs, reads/sends command
			       // and sleeps again
	int pingTimer;
	int pingTimeoutValue;
	publishMessages publish;
	subscribeMessages  sunscribe;
        //MQTT
	gateway gatewayInstance;
	public:
	deviceConnections() {
	}
	getGatewayInstance();
	registerAfterConnection();
	callbackFromDevices((topic, message,packet);
	addDeviceToDB(deviceID)
	searchDeviceInDB(DeviceID);
}	
	
deviceConnection(int type){
	deviceType = type;
	state = INIT;
	lastSyncTime = NULL;
	deviceNonPingable = false;
	pingTime = null;
	pingTimeoutValue = config.pingTimeOutValue; //10Seconds
	mqttDeviceClient.on('message',callbackFromDevices);

}
	
callbackFromDevices(topic, message,packet){
	var types = topic.split("/");
        console.log("Local Received topic is "+ topic +" message " +message  +"::" +types[1] +types[2]);
	switch(types[3]){
		case "REGISTER":
		     var jsonMessage = JSON.parse(message);
		     topic = createSubscribeTopicForDevices(jsonMessage);
		     console.log("Received registration from device, created topic" +jsonMessage.type +jsonMessage.mapping.id  +"::" +topic);
		     if(topic == "false") {
			//id = getDeviceIDForNewDevice(message);
		     	//message.mapping.id = id;
		     	//addDevcieToList(message);
		     }
		     	console.log("Device subscribing to STATUS for device " +types[2]);
			localClient.subscribe(topic,{qos:1,retain:true});
			topic = "/" + jsonMessage.type + "/" +jsonMessage.mapping.id +"/" +"ACCEPTED";
       			//+config.deviceRegistrationAccepted;
			localPublish(topic,jsonMessage.mapping.id);
			//Test
			//var timer_id=setInterval(function(){localPublish("/"+jsonMessage.type+"/"+jsonMessage.mapping.id +"/" +"ACTION","1",options);},5000);
		      break;
		case "DEREGISTER":
		     topic = createSubscribeTopicForDevices(message);
		     console.log("Received de-registration from device, created topic" +message +"::" +topic);
		     if(topic != "false") {
		     console.log("Device un-subscribing");
		     localClient.unsubscribe(topic); //topic list
		     }
		     break;

		case "STATUS":
		     console.log("got Status from device" +message +"::" +topic);
		     jasonMsg = convertDeviceMessageToJason(topic,message);
		     searchAndUpdate(topic,jasonMsg);
		     break;

		case "EMER":
		     break;

		 default:
			console.log("undefiend message from device" +message +"::" +topic);
	}
		     
});




