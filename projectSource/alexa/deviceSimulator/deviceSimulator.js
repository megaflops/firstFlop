var mqtt=require('../node_modules/mqtt');
var fs=require('fs');
var log=require('../common/trace');
var config=require("./deviceconfig");
var device=require("./deviceDes");
var Validator = require('../node_modules/jsonschema').Validator;
var deviceInstance;
var genID=0;
LOG_TAG = "DeviceSimulator";

var deviceAttributeSchema = {
    "id":"/simpleDeviceAttribute",
    "type":"object",
    "properties": {
        "model":{"type":"string"},
        "brand":{"type":"string"},
        "location":{"type":"string"},
        "locationName":{"type":"string"},
        "numConnections":{"type":"number","minimum":1},
        "connections":{
                    "type":"array",
                    "items":{
                        "state":{"type":"string"},
                        "as:":{"type":"string"},
                        "subTypeName":{"type":"string"},
                        "rating":{"type":"string"},
                        "currentState":{"type":"string"},
                        "requestedState":{"type":"string"},
                        "lastUpdated":{"type":"string"}
                      },
                      "required":["currentState","requestedState","lastUpdated"]
                    },
        },
        "required": ["numConnections","connections","location"]
        
};
var devInfoSchema = {
    "id":"/simpleDevice",
    "type":"object",
    "properties": {
        "version":{"type":"number"},
        "thingName":{"type":"string"},
        "deviceID":{"type":"string"},
        "thingSubTypeName":{"type":"string"},
        "attributes":{"$ref":"/simpleDeviceAttribute"},
    },
    "required": ["version","thingName","deviceID","thingSubTypeName"]
   
};
myJson = 
{
    "version": 3,
     "thingName": "switch",
     "deviceID": "DEVICE1FF1",
     "thingSubTypeName": "switch",
     "attributes": {
         "model": "123",
         "brand":"Amber",
         "location":"room1",
         "locationName":"guestRoom",
         "numConnections":2,
         "connections": [
          { "state":"on/off", "as":"light2","subTypeName":
             "tubeLight","rating":"6a","currentState":"off","requestedState":"off","lastUpdated":"0"
          },
          { "state":"on/off", "as":"light3","subTypeName":
             "tableLamp","rating":"6a","currentState":"off","requestedState":"off","lastUpdated":"0"
          }
        ]
  }
}
ErrorJson = 
{
    "version": 3,
     "thingName": "error",
     "deviceID": "error",
     "thingSubTypeName": "error",
     "attributes": {
         "model": "null",
         "brand":"Amber",
         "location":"room1",
         "locationName":"guestRoom",
         "numConnections":1,
         "connections": [
          { "state":"on/off", "as":"light2","subTypeName":
             "tubeLight","rating":"6a","currentState":"off","requestedState":"off","lastUpdated":"0"
          }
        ]
  }
}
/* create device instance */
var gDeviceID="default";
deviceInstance = new device(config);
deviceInstance.localBrokerConnect(config);
gDeviceJson = JSON.parse(JSON.stringify(myJson));
gErrorDeviceJson = JSON.parse(JSON.stringify(ErrorJson));
var publishOptions={
	retain:false,qos:1
}
var publishOptionsR={
	retain:true,qos:1
}
/* Call back functions */
deviceInstance.mqttDeviceClient.on("error",function(){
	log.Err(LOG_TAG,"CONNECT ERROR");
})
deviceInstance.mqttDeviceClient.on("connect",function(){
	log.Info(LOG_TAG,"CONNECTED  " +config.resetSubs);
	if(deviceInstance.state == config.stateInit){
        //Subscribe to status and action command from gateway;
        log.Info(LOG_TAG,"Subscribing accepted " +config.registerAcceptedSubs);
        deviceInstance.mqttDeviceClient.subscribe(config.resetSubs);
        deviceInstance.mqttDeviceClient.subscribe(config.statusSubs);
        deviceInstance.mqttDeviceClient.subscribe(config.actionSubs);
        deviceInstance.mqttDeviceClient.subscribe(config.registerAcceptedSubs);
        //Publish
        log.Info(LOG_TAG,"publish register cmd " +config.registerPublilsh +JSON.stringify(gDeviceJson));
        deviceInstance.mqttDeviceClient.publish(config.registerPublilsh,JSON.stringify(gDeviceJson),publishOptions);
        deviceInstance.state = config.stateConnected;
    }
    else
    log.Err(LOG_TAG,"Connected wrong state" +deviceInstance.state);
})
deviceInstance.mqttDeviceClient.on("reconnect",function(){
	log.Info(LOG_TAG,"RE-CONNECTED");
	if(deviceInstance.state == config.stateConnected){
		deviceInstance.state = config.stateInit;
	 }
})
deviceInstance.mqttDeviceClient.on('message',function(topic, message, packet){
    var types = topic.split("/");
    log.Info(LOG_TAG,"device Received topic is "+ topic +" message " +message  +"::" +types[config.deviceTypeIndex] 
    +types[config.commandIndex]);
    switch(types[config.commandIndex]){
        case "registeraccepted":
        genID=message;
        break;
        case "reset":
        log.Info(LOG_TAG,"publish register again");
        deviceInstance.mqttDeviceClient.publish(config.registerPublilsh,JSON.stringify(gDeviceJson),publishOptions);
        break;
        case "status":
        sendDeviceStatus(gDeviceJson);
        break;
        case "action":
        if(updateDeviceStatus(message,gDeviceJson) == 1){
            log.Info(LOG_TAG,"publish status after action");
            sendDeviceStatus(gDeviceJson);
        }
        else {
            log.Info(LOG_TAG,"publish status after action");
            sendDeviceStatus(gErrorDeviceJson);
            
        }
        break;
    }

})

function sendDeviceStatus(deviceJason){
    log.Info(LOG_TAG,"Sending status from device " +deviceJason.deviceID +config.statusPublilsh);
    deviceInstance.mqttDeviceClient.publish(config.statusPublilsh,JSON.stringify(deviceJason),publishOptionsR);
}
function updateDeviceStatus(message,deviceJason){
    jsonObj = JSON.parse(message);
    var i=0;
    var stateUpdated = 0;
    //var validateF = new Validator();
    //validateF.addSchema(deviceAttributeSchema,"/simpleDeviceConnection");
    //var v= validateF.validate(message,devInfoSchema).valid;
    //log.Info(LOG_TAG,"##" +deviceJason.attributes.numConnections +jsonObj.location +jsonObj.name
    //+deviceJason.attributes.location +deviceJason.attributes.connections[0].as);
    for(i=0; i< deviceJason.attributes.numConnections ; i++){
        if( (deviceJason.attributes.location == jsonObj.location) &&
            (deviceJason.attributes.version == jsonObj.version) &&
            (deviceJason.attributes.connections[i].as == jsonObj.name)
          )
        log.Info(LOG_TAG,"found action for device" +jsonObj.state);
        deviceJason.attributes.connections[i].currentState = jsonObj.state;
        deviceJason.attributes.connections[i].requestedState = jsonObj.state;
        stateUpdated = 1;
        break;
    }
    if(i >= deviceJason.attributes.numConnections){
        log.Err(LOG_TAG,"NO device found for action" +jsonObj.requestedState, +jsonObj.currentState);
    }
    return stateUpdated;
}