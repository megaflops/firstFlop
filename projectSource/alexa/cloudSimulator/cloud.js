/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

var fs=require('fs');
var log=require('./trace');
var config=require('./cloudConfig');
var cloud=require("./cloudDescriptor");
var gatewayDBClass=require("./cloudDB");
//var Validator = require('../node_modules/jsonschema').Validator;
var cloudInstance;
LOG_TAG_CLOUD = "cloud";
cloudState = "default";

gwDevicesJason = 
{
    "gatewayID":"error",
}
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

//localCloudInit();
/* create cloud instance */
module.exports.cloudInit = function(){
    cloudInstance = new cloud(config);
    cloudInstance.genID = "ff00";//math.rand();
    cloudConnect();
    cloudState = "init";
}
function localCloudInit(){
    cloudInstance = new cloud(config);
    cloudInstance.genID = "ff00";//math.rand();
    cloudConnect();
    cloudState = "init";
}
function cloudConnect(){
    log.Info(LOG_TAG_CLOUD,"cloud connect" +config.stateInit)
    cloudInstance.connect(config,cloudConnectCB,cloudErrorCB,cloudReConnectCB,cloudMessageCB);
}

/* Call back functions */
function cloudConnectCB(){
	log.Info(LOG_TAG_CLOUD,"CONNECTED  " +config.resetPublish);
	if(cloudInstance.state == config.stateInit){
		cloudInstance.subscribe(config.registerSubscription);
		cloudInstance.publish(config.resetPublish,cloudInstance.genID,config.publishOptions);
        cloudInstance.state = config.stateConnected;
    }
    else
    log.Err(LOG_TAG_CLOUD,"Connected wrong state" +cloudInstance.state);
}
function cloudReConnectCB(){
    log.Info(LOG_TAG_CLOUD,"RE-CONNECTED");
    cloudInstance.state = config.stateInit;
}
function cloudErrorCB(){
    log.Info(LOG_TAG_CLOUD,"ERROR");
}
function cloudMessageCB(topic, message, packet){
    var types = topic.split("/");
    log.Info(LOG_TAG_CLOUD,"Received topic is "+ topic +" message " +message  +"::" +types[config.deviceTypeIndex] 
    +types[config.commandIndex]);
    switch(types[config.commandIndex]){
        case "register":
        var gwInfo = createOrAddGatewayDB(message);
        gatewayID = gwInfo.gatewayID;
        gatewayNameType = gwInfo.gatewayNameType;
        if(gatewayID != "error"){
            var publishCmd = "/"+gatewayNameType+config.registeracceptedPublish+gatewayID;
            log.Info(LOG_TAG_CLOUD,"Publish register accepted  " +publishCmd +" message " +cloudInstance.genID);
            log.Info(LOG_TAG_CLOUD,"subscribe status " +config.statusSubscription);
            cloudInstance.publish(publishCmd,cloudInstance.genID,config.publishOptions);
            cloudInstance.subscribe(config.statusSubscription);
            cloudInstance.state=config.stateRegistered;
        }
        else
           log.Info(LOG_TAG_CLOUD,"something wrong with gateway JSON");
           break;
        case "deregister":
           log.Info(LOG_TAG_CLOUD,"recived de register command");
           break;
        case "status":
           log.Info(LOG_TAG_CLOUD,"recived status command");
           parseStatusFromGateway(message);
           break;
        default:
          log.Err(LOG_TAG_CLOUD, "Wrong command" +types[config.commandIndex]);
    }
}
function createOrAddGatewayDB(message){
    log.Info(LOG_TAG_CLOUD,"Validating jason  ");
    var jObj = validateJason(message);
    var i;
    var gatewayDB;
    if(jObj != null) {
        log.Info(LOG_TAG_CLOUD,"create/update DB for gateway  " +jObj.gatewayID +"  Total device in db " +cloudInstance.gatewayArray.length);
        for(i=0;  i < cloudInstance.gatewayArray.length; i++){
            if(cloudInstance.gatewayArray[i].gatewayID == jObj.gatewayID) {
                log.Info(LOG_TAG_CLOUD,"gateway id already existed in db " +jObj.gatewayID);
                break;
            }
        }
        if(i >= cloudInstance.gatewayArray.length){
            log.Info(LOG_TAG_CLOUD,"gateway id creating fresh db " +jObj.gatewayID);
            if(jObj.gatewayID == "error"){
                log.Err(LOG_TAG_CLOUD,"Not a valid json from gateway ignore")
            }
            else{
            var gatewayDB  = new gatewayDBClass(jObj);
            cloudInstance.gatewayArray.push(gatewayDB);
            }
        }
   }
    else {
        log.Err(LOG_TAG_CLOUD,"Wrong Json received" +message);
        return {
                gatewayID:"error",
                gatewayNameType:"error"
        }
    }
    return {
        gatewayID:jObj.gatewayID,
        gatewayNameType:jObj.gatewayNameType
      }
 }
//module.exports=prepareActionFromJason;
function validateJason(message){
    try {
        var jObj = JSON.parse(message);
        // if came to here, then valid
    } catch(e) {
        // failed to parse
        return null;
    }
    //var validateF = new Validator();
    //validateF.addSchema(deviceListJasonSchema,"/simpleDeviceListJasonAttribute");
    //var v= validateF.validate(jObj,deviceListJasonSchema).valid;
    var v = 1;
    if(v)
        return jObj;
    return null;
}

function parseStatusFromGateway(message){
    var jsonObj=null;
    var i,j,k;
    jsonObj = validateJason(message);
    if(jsonObj)
    {
        if(jsonObj.gatewayID == "error"){
            log.Info(LOG_TAG_CLOUD ,"######### ERROR ###########");
        }
        else{
        //log.Info(LOG_TAG_CLOUD, "####" +cloudInstance.gatewayArray.length +cloudInstance.gatewayArray[0].gatewayID);
        for(i=0;  i < cloudInstance.gatewayArray.length; i++){
            if(cloudInstance.gatewayArray[i].gatewayID == jsonObj.gatewayID) {
                for(j=0; j<jsonObj.numberLocations ; j++){
                    for(k=0; k<jsonObj.locations[i].numberDevices ; k++){
                        log.Info(LOG_TAG_CLOUD," #### STATE " 
                                    +jsonObj.locations[j].devices[k].as +jsonObj.locations[j].devices[k].currentState);
                           // test code
                           /*
                           if(jsonObj.locations[j].name == gTestInputJason1.location &&
                            jsonObj.locations[j].devices[k].as == gTestInputJason1.name
                            ){
                                log.Info(LOG_TAG_CLOUD,"Updated testjson1 state"+jsonObj.locations[j].devices[k].currentState);
                                gTestInputJason1.state = jsonObj.locations[j].devices[k].currentState
                            }
                            if(jsonObj.locations[j].name == gTestInputJason1.location &&
                                jsonObj.locations[j].devices[k].as == gTestInputJason2.name
                                ){
                                    log.Info(LOG_TAG_CLOUD,"Updated testjson2 state"+jsonObj.locations[j].devices[k].currentState);
                                    gTestInputJason2.state = jsonObj.locations[j].devices[k].currentState
                                }

                        */
                    }
                    
                }
                /* update device json*/
                log.Info(LOG_TAG_CLOUD,"updating Cloud Json" +i);
                cloudInstance.gatewayArray[i].pending = 0;
                cloudInstance.gatewayArray[i].gatewayDeviceListJson = JSON.stringify(jsonObj);
            }
       }
     }
    }
    else {
        log.Err(LOG_TAG_CLOUD,"parse json failed" +JSON.stringify(message));
    }
 }
var returnJson={
    "version":3,
    "location":"xxxxxxxx",
    "locationName":"xxxxxxxxx",
    "name":"xxxxxxxx",
    "nameas":"xxxxxxxx",
    "state":"xxxxxxxxx",
    "return":"failure",
    "commandType":"xxxxxxxxx"
}

function   verifyCommandId(inputJson,index){
    var JsonObj,j,k;
    JsonObj = JSON.parse(cloudInstance.gatewayArray[index].gatewayDeviceListJson);
    for(j=0; j < JsonObj.numberLocations ; j++){
        log.Info(LOG_TAG_CLOUD,"location:" +JsonObj.locations[j].name +inputJason.location);
            if(JsonObj.locations[j].name == inputJason.location){
            log.Info(LOG_TAG_CLOUD,"name:" +JsonObj.locations[j].devices[0].as +inputJason.name);
            for(k=0 ; k < JsonObj.locations[j].numberDevices; k++){
                if(JsonObj.locations[j].devices[k].as == inputJason.name){
                    log.Info(LOG_TAG_CLOUD,"cmd ID:"+JsonObj.locations[j].devices[k].cmdId +inputJason.cmdId);
                        if(JsonObj.locations[j].devices[k].cmdId == inputJason.cmdId){
                          log.Info(LOG_TAG_CLOUD,"cmd ID matched return now");
                          return 1;
                        }
                    }
            }
        }    
    }
    return 0;   
}
var tid2=null;
function cbOnWaitForStatus(gatewayId,tid1,inputJason,resolve){
    var i;
    for(i=0;  i < cloudInstance.gatewayArray.length; i++){
        if(cloudInstance.gatewayArray[i].gatewayID == gatewayId) {
            if(cloudInstance.gatewayArray[i].pending==1){
                log.Info(LOG_TAG_CLOUD,"call back pending is still 1");
                tid2 =setTimeout(cbOnWaitForStatus,1000,gatewayId,tid1,inputJason,resolve);
                break;
            }
            else{
                log.Info(LOG_TAG_CLOUD,"promise pending is now 0 ");
                if(verifyCommandId(inputJason,i)){
                    log.Info(LOG_TAG_CLOUD,"cmd id matched");
                    clearTimeout(tid1);
                    resolve("success");
                    break;
                }
                else{
                    log.Info(LOG_TAG_CLOUD,"cmd id mis matched");
                }
               
            }
          }
    }
}
function waitForStatusResponseFromGateway(gatewayId,inputJason){
    var tid1=null;
    return new Promise (function (resolve, reject){
        tid1=setTimeout( function() {
            clearTimeout(tid2);
            resolve("success");
            //reject("error");
           },5000
        );
        //tid2=setTimeout(cbOnWaitForStatus,1000,gatewayId,tid1,inputJason,resolve);
    })
}
var gTestVar =0;
module.exports.parseAndPrepareActionToGateway = function(inputJasonStr){
    var json;
    json = internalparseAndPrepareActionToGateway(inputJasonStr);
    return json;
}
async function internalparseAndPrepareActionToGateway(inputJasonStr){
    var state;
    var i,j,k;
    var JsonObj;
    var calledWithLightName=0;
    var calledWithLocationName=0;
    inputJason = JSON.parse(inputJasonStr);
    inputJason.cmdId = Math.floor((Math.random() * 100000));
    returnJson.return = "failure";
    returnJson.name = inputJason.name;
    returnJson.location = inputJason.location;
    returnJson.commandType = inputJason.commandType;
    if(inputJason.commandType != 'status')
        returnJson.state = inputJason.state;
    if(cloudState == 'default')
        return JSON.stringify(returnJson);
    log.Info(LOG_TAG_CLOUD,"num gateway" +cloudInstance.gatewayArray.length);
    for(i=0; i< cloudInstance.gatewayArray.length; i++){
        JsonObj = JSON.parse(cloudInstance.gatewayArray[i].gatewayDeviceListJson);
        for(j=0; j < JsonObj.numberLocations ; j++){
            log.Info(LOG_TAG_CLOUD,"location:" +JsonObj.locations[j].name +inputJason.location);
             if( (JsonObj.locations[j].name == inputJason.location) ||
                 (calledWithLocationName=(JsonObj.locations[j].locationName == inputJason.location))
                 ){
                for(k=0 ; k < JsonObj.locations[j].numberDevices; k++){
                    if( (JsonObj.locations[j].devices[k].as == inputJason.name) ||
                        (calledWithLightName=(JsonObj.locations[j].devices[k].subTypeName == inputJason.name))
                      )
                        {
                        log.Info(LOG_TAG_CLOUD,"location & device name MATCHED " +inputJason.location
                        +inputJason.name);
                        state = JsonObj.locations[j].devices[k].currentState;
                        if(inputJason.commandType == 'status'){
                            log.Info(LOG_TAG_CLOUD, "received cmd for stauts from cloud" +state);
                            returnJson.version = 3;
                            returnJson.location = inputJason.location;
                            returnJson.name = inputJason.name;
                            returnJson.state = state;
                            returnJson.commandType = inputJason.commandType;
                            returnJson.return = "success";
                            if(calledWithLocationName == 0){
                                returnJson.locationName = JsonObj.locations[j].locationName;
                            }
                            else{
                                returnJson.locationName = JsonObj.locations[j].name;
                                returnJson.location = JsonObj.locations[j].locationName;
                                inputJason.location = JsonObj.locations[j].name;
                            }
                            if(calledWithLightName == 0){
                                returnJson.nameas = JsonObj.locations[j].devices[k].subTypeName;
                            }
                            else{
                                returnJson.nameas = JsonObj.locations[j].devices[k].as;
                                returnJson.name = JsonObj.locations[j].devices[k].subTypeName;
                                inputJason.name = JsonObj.locations[j].devices[k].as;
                            }
                            return JSON.stringify(returnJson);
                        }
                        else{
                            log.Info(LOG_TAG_CLOUD, "received cmd for action from cloud" +state);
                            log.Info(LOG_TAG_CLOUD, "Rest" + JsonObj.locations[j].locationName
                                                            +inputJason.name
                                                            +inputJason.location
                                                            +JsonObj.locations[j].devices[k].subTypeName
                            );
                            returnJson.version = 3;
                            returnJson.location = inputJason.location;
                            returnJson.name = inputJason.name;
                            //Dont send the current state as response
                            //returnJson.state = state;
                            returnJson.commandType = inputJason.commandType;
                            if(calledWithLocationName == 0){
                                returnJson.locationName = JsonObj.locations[j].locationName;
                            }
                            else{
                                //log.Err(LOG_TAG_CLOUD, "Test locaion before" +JSON.stringify(inputJason) 
                               // +JsonObj.locations[j].locationName +JsonObj.locations[j].name
                                //+JsonObj.locations[j].devices[k].as +JsonObj.locations[j].devices[k].subTypeName);
                                returnJson['location'] = JsonObj.locations[j].locationName;
                                returnJson['locationName'] = JsonObj.locations[j].name;
                                inputJason['location'] = JsonObj.locations[j].name;
                                //log.Err(LOG_TAG_CLOUD, "Test locaion after" +JSON.stringify(inputJason) +JSON.stringify(returnJson));
                            }
                            if(calledWithLightName == 0){
                                returnJson['nameas'] = JsonObj.locations[j].devices[k].subTypeName;
                            }
                            else{
                                returnJson['nameas'] = JsonObj.locations[j].devices[k].as;
                                returnJson['name'] = JsonObj.locations[j].devices[k].subTypeName;
                                inputJason['name'] = JsonObj.locations[j].devices[k].as;
                            }
                            if(state == inputJason.state){
                                returnJson.return = "samestate";
                                log.Info(LOG_TAG_CLOUD, "received action and current state is same" +state);
                            }
                            else{
                                returnJson.return = "success";
                                var actionCmd = "/"+cloudInstance.gatewayArray[i].gatewayNameType
                                           +config.actionPublish
                                          +cloudInstance.gatewayArray[i].gatewayID;
                                log.Info(LOG_TAG_CLOUD," #### action command ####" +actionCmd +"json" +JSON.stringify(inputJason));
                                cloudInstance.publish(actionCmd,JSON.stringify(inputJason),config.publishOptions);
                                cloudInstance.gatewayArray[i].pending=1;
                                /*const  mypromise = await waitForStatusResponseFromGateway(cloudInstance.gatewayArray[i].gatewayID,inputJason);
                                var status = mypromise;
                                if(status == "error"){
                                    log.Info(LOG_TAG_CLOUD,"promise returned error");
                                    returnJson.return = "failure";
                                }
                                else{
                                    log.Info(LOG_TAG_CLOUD,"promise returned Success");
                                }*/
                            }
                            log.Info(LOG_TAG_CLOUD,"return Json" +JSON.stringify(returnJson));
                            return JSON.stringify(returnJson);    
                        }
                    } /* end for if*/
                }//* end for for*/
                if(k > JsonObj.locations[j].numberDevices){
                   log.Err(LOG_TAG_CLOUD,"No device with name found" +inputJason.name)
                }
            }
        }/*for */
       if(j > JsonObj.numberLocations){
            log.Info(LOG_TAG_CLOUD,"Device name MISMATCHED" +inputJason.location);
        }
    }/*for*/
    if(cloudInstance.gatewayArray.length == 0){
        log.Info(LOG_TAG_CLOUD,"No device in DB" +cloudInstance.gatewayArray.length);
        returnJson.return = "noinit";
        /*
        //test
        gTestVar =1;
        log.Info(LOG_TAG_CLOUD,"now waiting");
        const myPromise = await  mysleep(5000);
        log.Info(LOG_TAG_CLOUD,"myslep retured");
        */
        //
    }
    return JSON.stringify(returnJson);
}
function *waitForResponse(){
    var wait = yield mysleep(5000);
}
function mysleep(millis) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () { 
        console.log("Timer retruned");resolve("success"); 
        gTestVar=0;}
        , millis);
    });
}

gTestInputJason1= 
{
        "version":3,
        "location":"room1",
        "name":"light2",
        "state":"on"
}

gTestInputJason2= 
{
        "version":3,
        "location":"room1",
        "name":"light3",
        "state":"on"
}
var pingPong=0;
var gatewayID="GATEWAY1FF1";

function timerCB(){
   
    if(pingPong == 0){
        log.Info(LOG_TAG_CLOUD,"Timer prepare action for" +gTestInputJason1.name);
        prepareActionToGateway(gTestInputJason1,gatewayID);
        pingPong=1;
    }
    else{
        log.Info(LOG_TAG_CLOUD,"Timer prepare action for" +gTestInputJason2.name);
        prepareActionToGateway(gTestInputJason2,gatewayID);
        pingPong=0;
    }

}
function startActionTimer(){
    setTimeout(timerCB, 10000);
}
