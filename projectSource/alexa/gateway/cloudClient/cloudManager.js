/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

var mqtt=require('../../node_modules/mqtt');
var fs=require('fs');
var log=require('../../common/trace');
var config=require("./gatewayCloudConfig");
var gateway=require("../gatewayCommon/gatewayMqttDes");
var common=require("../gatewayCommon/common");
var dm=require("../deviceClient/deviceManager");
var Validator = require('../../node_modules/jsonschema').Validator;
var gwCloudInstance=null;
var gDeviceListJasonGenerated=0;
var cloudGenID="1";
LOG_TAG = "CloudMgr";
gwErrorDevicesJason = 
{
    "gatewayID": "error"
}
gwIntermidiateDevicesJason = 
{
    "gatewayID": "intermidate"
}
//cloudManagerInit1();
function cloudManagerInit1() {
    gwCloudInstance = new gateway(common);
    gwCloudInstance.genID = "ff";//math.rand();
    cloudConnect();
}

/* create device manager instance */
module.exports.cloudManagerInit = function(){
    gwCloudInstance = new gateway(common);
    gwCloudInstance.genID = "ff";//math.rand();
    cloudConnect();
}
function cloudConnect(){
    log.Info(LOG_TAG,"cloud mgr connect" +common.stateInit +common.gatewayID +common.stateInit)
    gwCloudInstance.connect(common,"cloud",connectCB,errorCB,reConnectCB,messageCB);
}

/* Call back functions */
function  errorCB(){
	log.Err(LOG_TAG,"CONNECT ERROR");
}
function connectCB(){
	log.Info(LOG_TAG,"CONNECTED  " );
	if(gwCloudInstance.state == common.stateInit){
		log.Info(LOG_TAG,"Subscribing accepted " +config.registerAcceptedSubscription +config.resetSubscription);
        gwCloudInstance.subscribe(config.resetSubscription);
        gwCloudInstance.subscribe(config.statusSubscription);
        gwCloudInstance.subscribe(config.actionSubscription);
        gwCloudInstance.subscribe(config.registerAcceptedSubscription);
        //Publish
        if(gDeviceListJasonGenerated == 1){
        var json = getDevicesListJason();
        log.Info(LOG_TAG,"dev json was ready so publish register " +config.registerPublilsh +JSON.stringify(json));
        gwCloudInstance.publish(config.registerPublilsh,JSON.stringify(json),common.publishOptions);
        gDeviceListJasonGenerated=0;
        } 
        gwCloudInstance.state = common.stateConnected;
    }
    else
    log.Err(LOG_TAG,"Connected wrong state" +gwCloudInstance.state);
}
function reConnectCB(){
    log.Info(LOG_TAG,"RE-CONNECTED");
    gwCloudInstance.state = common.stateInit;
}
function messageCB(topic, message, packet){
    var types = topic.split("/");
    log.Info(LOG_TAG,"Local Received topic is "+ topic +" message " +message  +"::" +types[config.deviceTypeIndex] 
    +types[config.commandIndex]);
    var types = topic.split("/");
    switch(types[config.commandIndex]){
        case "registeraccepted":
        gwCloudInstance.genID=message;
        gwCloudInstance.state=common.stateRegistered;
        break;

        case "reset":
        if(gwCloudInstance.state == common.stateRegistered)
            gwCloudInstance.publish(config.registerPublilsh,JSON.stringify(getDevicesListJason()),common.publishOptions);
        else
            log.Err(LOG_TAG,"Reset received state is not registered"+  gwCloudInstance.state);
        break;

        case "status":
        if(gwCloudInstance.state == common.stateRegistered)
           sendGatewayStatus(JSON.stringify(getDevicesListJason()) );
        else
            log.Err(LOG_TAG,"status cmd form cloud in wrong state" +gwCloudInstance.state);
        break; 

        case "action":
        if(verifyAndPublishAction(message) == 0){
            //log.Info(LOG_TAG,"publish status after action");
            //sendGatewayStatus(gwIntermidiateDevicesJason);
        }
        else{
            log.Info(LOG_TAG,"publish ERROR status after action");
            sendGatewayStatus(gwErrorDevicesJason);
        }

        break;
    }
}
function verifyAndPublishAction(message){
    //var validateF = new Validator();
    //validateF.addSchema(deviceAttributeSchema,"/simpleDeviceConnection");
    //var v= validateF.validate(message,devInfoSchema).valid;
    //log.Info(LOG_TAG,"##" +deviceJason.attributes.numConnections +jsonObj.location +jsonObj.name
    //+deviceJason.attributes.location +deviceJason.attributes.connections[0].as);
    /* On success return 0 
       means wait for final response from device
       on error return error 
    */
   return dm.prepareActionFromJason(message);
}

function validateJason(message,validation){
    var jObj;
    try {
          var jObj = JSON.parse(message);
          // if came to here, then valid
    } catch(e) {
          // failed to parse
          return null;
    }
    if(validation){
        var validateF = new Validator();
        validateF.addSchema(gwDevicesAttributeSchema,"/simpleDevicesAttributeSchema");
        var v= validateF.validate(jObj,gwDevicesAttributeSchema).valid;
        if(v)
        return jObj;
        return null;
    }
    else
        return jObj;
}
/*Called from device manager on receive of status from device
message is a valid device jason or with error
*/
module.exports.verifyAndPublishStatus = function(json){
    if(gwCloudInstance && gwCloudInstance.state == common.stateConnected){
        var json = getDevicesListJason();
        log.Info(LOG_TAG,"publish register cmd to cloud" +config.registerPublilsh);
        gwCloudInstance.publish(config.registerPublilsh,JSON.stringify(json),common.publishOptions);
        gwCloudInstance.state = common.stateRegistered;
    }
    else if(gwCloudInstance && (gwCloudInstance.state == common.stateRegistered))
            gwCloudInstance.publish(config.statusPublilsh,JSON.stringify(json),common.publishOptions);
    else{
        log.Err(LOG_TAG,"wrong state in verifyAndPublishStatus" +gwCloudInstance.state);
        gDeviceListJasonGenerated = 1;
    }
}

function getDevicesListJason(){
    var json = dm.getDevicesListJason();
    log.Info(LOG_TAG,"device list JSON From gateway" +json);
    return json;
}
function sendGatewayStatus(json){
    log.Info(LOG_TAG,"Sending status to cloud",+JSON.stringify(json));
    gwCloudInstance.publish(config.statusPublilsh,JSON.stringify(json),common.publishOptions);
}