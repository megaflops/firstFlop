/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
var mqtt=require('../../node_modules/mqtt');
var fs=require('fs');
var log=require('../../common/trace');
var config=require("./config");
var gateway=require("../gatewayCommon/gatewayMqttDes");
var common=require("../gatewayCommon/common");
var deviceDb=require("./deviceDB.js");
var cm=require("../cloudClient/cloudManager");
var Validator = require('../../node_modules/jsonschema').Validator;
var gwInstance;
var genID="1";
LOG_TAG_DM = "DeviceMgr";

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

var deviceListJasonSchema = {
    "id":"/simpleDeviceListJasonAttribute",
    "type":"object",
    "properties": {
        "gatewayID":{"type":"string"},
        "gatewayNameType":{"type":"string"},
        "numberLocations": {"type":"number"},
        "locations":{
            "type":"array",
            "items":{
                    "name":{"type":"string"},                
                    "locationName":{"type":"string"},
                    "numberDevices":{"type":"number"},
                    "devices": {
                     "type":"array",
                        "items":{
                                "as":{"type":"string"},
                                "state":{"type":"string"},
                                "subTypeName":{"type":"string"},
                                "currentState":{"type":"string"},
                                "requestedState":{"type":"string"},
                                 },
                        "required": ["as","state","subTypeName","currentState"],
                      }
                    }
                }
            },
        "required": ["gatewayID","gatewayNameType","numberLocations","numberLocations"]
}
gwDevicesListJason = 
{
    "gatewayID":"error",
    "gatewayNameType":"error",
    "numberLocations": 1,
    "locations": [
                    {
                        "devices" : [
                                {

                                }
                        ]
                   }
                ]
}
gwDevicesListJasonError = 
{
    "gatewayID":"error",
    "gatewayNameType":"error",
    "numberLocations": 0
}
/* create device manager instance */
function deviceManagerInit1(){
    gwInstance = new gateway(common);
    gwInstance.genID = "ff";//math.rand();
}
function itrateOverDeviceDB(locationCount,searchFor){
    var j=0;
    var count=0;
    var llocation=0;
    gwDevicesListJason.gatewayID = common.gatewayID;
    gwDevicesListJason.gatewayNameType = common.gatewayNameType;
    console.log("itrate " +locationCount +searchFor);
    for(i=0; i<gwInstance.deviceArray.length ; i++){
        if(gwInstance.deviceArray[i].location == searchFor){
            count++;
            llocation = i;
        }
    }
    if(count == 0){
        log.Err(LOG_TAG_DM,"NO device found with" +searchFor);
        return 0;
    }
    console.log("got device with " +searchFor +count);
    if(typeof(gwDevicesListJason.locations) == 'undefined'){
            console.log("gwDevicesListJason.locations is not defined");
            gwDevicesListJason.locations = [];
    }
    gwDevicesListJason.locations[locationCount] = { "name" : gwInstance.deviceArray[llocation].location,
                                                    "locationName" : gwInstance.deviceArray[llocation].locationName
                                                };
    gwDevicesListJason.numberLocations = locationCount +1;
    if( typeof(gwDevicesListJason.locations[locationCount].devices) == 'undefined'){
        console.log("gwDevicesListJason.locations.devices is not defined");  
        gwDevicesListJason.locations[locationCount].devices = [];
    }
    for(i=0; i<gwInstance.deviceArray.length ; i++){
        if(gwInstance.deviceArray[i].location == searchFor){
                                 
            gwDevicesListJason.locations[locationCount].devices[i] = {
                                                                  "as":gwInstance.deviceArray[i].as,
                                                                  "state":gwInstance.deviceArray[i].state,
                                                                  "subTypeName":gwInstance.deviceArray[i].subTypeName,
                                                                  "currentState":gwInstance.deviceArray[i].currentState,
                                                                  "requestedState":gwInstance.deviceArray[i].requestedState
                                                                 };
           
            j++;
       }
    }
    gwDevicesListJason.locations[locationCount].numberDevices = i; 
    return count;
}
function generateJasonFromDeviceDB(){
    var tlocations = ["room1","room2","room3"];
    var i,ret,counter=0;
    for(i=0; i < tlocations.length; i++){
        ret = itrateOverDeviceDB(counter,tlocations[i]);
        if(ret)
            counter++;
    }
    return counter;
}
module.exports.deviceManagerInit = function(){
    gwInstance = new gateway(common);
    gwInstance.genID = "ff";//math.rand();
    deviceManagerConnect();
}
function deviceManagerConnect(){
    gwInstance.connect(common,"local",dmConnectCB,dmErrorCB,dmReConnectCB,dmMessageCB);
}
/* Call back functions */
function dmConnectCB(){
	log.Info(LOG_TAG_DM,"CONNECTED  " +config.resetPublish +config.registerSubscription);
	if(gwInstance.state == common.stateInit){
		gwInstance.subscribe(config.registerSubscription);
		gwInstance.publish(config.resetPublish,genID,common.publishOptions);
        gwInstance.state = common.stateConnected;
    }
    else
    log.Err(LOG_TAG_DM,"Connected wrong state" +gwInstance.state);
}
function dmReConnectCB(){
    log.Info(LOG_TAG_DM,"RE-CONNECTED");
    gwInstance.state = common.stateInit;
}
function dmErrorCB(){
    log.Info(LOG_TAG_DM,"ERROR");
}

function dmMessageCB(topic, message, packet){
    var types = topic.split("/");
    log.Info(LOG_TAG_DM,"Local Received topic is "+ topic +" message " +message  +"::" +types[config.deviceTypeIndex] 
    +types[config.commandIndex]);
    switch(types[config.commandIndex]){
        case "register":
        var devInfo = createOrAddDeviceDB(message);
        deviceID = devInfo.devID;
        devTypeName = devInfo.devTypeName;
        if(deviceID != "ff"){
            var publishCmd = "/"+devTypeName+config.registeracceptedPublish+deviceID;
            log.Info(LOG_TAG_DM,"Publish register accepted  " +publishCmd +" message " +genID);
            log.Info(LOG_TAG_DM,"subscribe status " +config.statusSubscription);
            gwInstance.publish(publishCmd,genID,common.publishOptions);
            gwInstance.subscribe(config.statusSubscription);
            gwInstance.state = common.stateRegistered;
        }
        else
           log.Info(LOG_TAG_DM,"something wrong with device JSON");
           break;
        case "deregister":
           log.Info(LOG_TAG_DM,"recived de register command");
           break;
        case "status":
           log.Info(LOG_TAG_DM,"recived status command");
           parseStatusFromDevice(message);
           break;
        default:
          log.Err(LOG_TAG_DM, "Wrong command" +types[config.commandIndex]);
    }
}
function validateAndUpdateDeviceDB(message){
    var deviceFound=false;
    var numEntries=0;
    var jObj;
    log.Info(LOG_TAG_DM,"Validating jason  ");
    var jObj = validateJason(message,"deviceJson");
    if(jObj != null) {
        log.Info(LOG_TAG_DM,"update DB for device  " +jObj.deviceID +"  Total device in db " +gwInstance.deviceArray.length);
        numEntries = 0;
        for(var i=0;  i < gwInstance.deviceArray.length; i++){
            var deviceIDIndex = (gwInstance.deviceArray[i].deviceID == jObj.deviceID);
            //(gwInstance.deviceArray.indexOf(jObj.deviceID,i);
            var locationIndex =  (gwInstance.deviceArray[i].location == jObj.attributes.location);
            if( (deviceIDIndex != 0) && (locationIndex != 0) ){
                log.Info(LOG_TAG_DM,"status Got db entry at " +i +"for device " +jObj.deviceID);
                updateDbEntryWithJson(i,jObj,numEntries);
                numEntries++;
            }
        }
        if(numEntries == 0){
            log.Info(LOG_TAG_DM,"Status from device NO entry was updated");
            return -1;
        }
    }
    return 0;
}
function createOrAddDeviceDB(message){
    var deviceFound=false;
    var numEntries=0;
    var jObj;
    log.Info(LOG_TAG_DM,"Validating jason  ");
    var jObj = validateJason(message,"deviceJson");
    if(jObj != null) {
        log.Info(LOG_TAG_DM,"create/update DB for device  " +jObj.deviceID +"  Total device in db " +gwInstance.deviceArray.length);
        numEntries = 0;
        for(var i=0;  i < gwInstance.deviceArray.length; i++){
            var deviceIDIndex = (gwInstance.deviceArray[i].deviceID == jObj.deviceID);
            //(gwInstance.deviceArray.indexOf(jObj.deviceID,i);
            var locationIndex =  (gwInstance.deviceArray[i].location == jObj.attributes.location);
            if( (deviceIDIndex != 0) && (locationIndex != 0) ){
                log.Info(LOG_TAG_DM,"Got db entry at " +i +"for device " +jObj.deviceID);
                updateDbEntryWithJson(i,jObj,numEntries);
                numEntries++;
            }
        }
        while(numEntries < jObj.attributes.numConnections){
            log.Info(LOG_TAG_DM,"new device found " +jObj.deviceID);
            var deviceDbObj = new deviceDb(jObj,numEntries);
            gwInstance.deviceArray.push(deviceDbObj);
            numEntries++;
        }
   }
    else {
        log.Err(LOG_TAG_DM,"Wrong Json received" +message);
        return {
                devID:"ff",
                devTypeName:"null"
        }
    }
    return {
        devID:jObj.deviceID,
        devTypeName:jObj.thingName
      }
 }
 
function updateDbEntryWithJson(dbIndex,jasonObj,subDeviceIndex){
    gwInstance.deviceArray[dbIndex].location=jasonObj.attributes.location;
    gwInstance.deviceArray[dbIndex].locationName=jasonObj.attributes.locationName;
    gwInstance.deviceArray[dbIndex].as=jasonObj.attributes.connections[subDeviceIndex].as;
    gwInstance.deviceArray[dbIndex].state=jasonObj.attributes.connections[subDeviceIndex].state;
    gwInstance.deviceArray[dbIndex].currentState=jasonObj.attributes.connections[subDeviceIndex].currentState;
    gwInstance.deviceArray[dbIndex].subTypeName=jasonObj.attributes.connections[subDeviceIndex].subTypeName;
    gwInstance.deviceArray[dbIndex].lastUpdated=gwInstance.deviceArray[dbIndex].lastUpdated;
}
module.exports.prepareActionFromJason = function(inputJson){
    jObj = JSON.parse(inputJson);
    if(jObj != null) {
        for(var i=0; i < gwInstance.deviceArray.length; i++){
            //log.Info(LOG_TAG_DM,"##" +gwInstance.deviceArray[i].location +jObj.location +gwInstance.deviceArray[i].as +jObj.name)
            if( (gwInstance.deviceArray[i].location == jObj.location) &&
                (gwInstance.deviceArray[i].as == jObj.name)
            ) {
                var action = "/"+gwInstance.deviceArray[i].devTypeName+config.actionPublish+gwInstance.deviceArray[i].deviceID;
                log.Info(LOG_TAG_DM,"action to device " +gwInstance.deviceArray[i].deviceID +" action " +action);
                gwInstance.publish(action,inputJson,common.publishOptionsR);
                break;
            }   
        }
        if(i >= gwInstance.deviceArray.length){
            log.Err(LOG_TAG_DM,"action recived Device not matched");
            return 1;
        }
    }
    else{
        log.Err(LOG_TAG_DM,"action JSON is not correct");
    }
    return 0;
}
function validateJason(message,target){
    var jObj;
    try {
          var jObj = JSON.parse(message);
          // if came to here, then valid
    } catch(e) {
          // failed to parse
          log.Err(LOG_TAG_DM,"validateJason failed to parse json")
          return null;
    }
    var validateF = new Validator();
    if(target=="deviceJson"){
        //validateF.addSchema(deviceAttributeSchema,"/simpleDeviceAttribute");
        validateF.addSchema(deviceAttributeSchema,"/simpleDeviceAttribute");
        var v= validateF.validate(jObj,devInfoSchema).valid;
    }
    else if (target == "deviceListJson"){
        //validateF.addSchema(deviceListJasonSchema,"/simpleDeviceListJasonAttribute");
        //console.log(validateF.validate(jObj,deviceListJasonSchema).valid);
        var v= validateF.validate(jObj,deviceListJasonSchema).valid;
    }
    else{
        log.Err(LOG_TAG_DM,"validate jason target is wrong" +target);
    }
    if(v)
      return jObj;
    return null;
}
function parseStatusFromDevice(message){
    var deviceListJason = gwDevicesListJasonError;
    if(validateAndUpdateDeviceDB(message) == 0){
        if(generateJasonFromDeviceDB() > 0){
            if(validateJason(JSON.stringify(gwDevicesListJason),"deviceListJson"))
                deviceListJason=gwDevicesListJason;
            else
                log.Info(LOG_TAG_DM, "device list json validation failed");
        }
        else
            log.Info(LOG_TAG_DM, "generateJasonFromDeviceDB failed");
    }
    else{
        log.Err(LOG_TAG_DM,"Validation json failed for status " +message)
    }
    //log.Info(LOG_TAG_DM, "DEVICE list Jason" +JSON.stringify(deviceListJason));
    cm.verifyAndPublishStatus(deviceListJason);
}
module.exports.getDevicesListJason = function(inputJson){
    return gwDevicesListJason;
}