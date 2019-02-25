var mqtt=require('../../../mqtt/client/node_modules/mqtt');
var gateway = require("./gatewayClassesDecs.js");
var deviceConnection = require("./gatewayDeviceClassesDecs.js");
var log = require('./trace');
var config=require("./config");
var cloudConfig=require("./cloudConfig");
var fs = require('fs');
var gJasonObject = JSON.parse(fs.readFileSync('./iotConfigs.json', 'utf8'));

var LOG_TAG="GW_DEVICE"
var LOG_TAG_C="GW_CLOUD"
var publishOptionsR={
	retain:true,qos:1
}
var publishOptions={
	retain:false,qos:1
}
//////////// Cloud Config /////////////////////
var gwCloudInstance = new gateway(cloudConfig);
gwCloudInstance.config(cloudConfig);

gwCloudInstance.cloudConnect(cloudConfig);
gwCloudInstance.mqttCloudClient.on("error",function(){
	log.Err(LOG_TAG_C,"CONNECT");
})
gwCloudInstance.mqttCloudClient.on("connect",function(){
	log.Info(LOG_TAG_C,"CONNECTED");
	if(gwCloudInstance.state == cloudConfig.STATE_INIT){
		var jsonStr = JSON.stringify(gJasonObject);
		gwCloudInstance.mqttCloudClient.subscribe(gwCloudInstance.subscribeMessages.registerAcc());
		gwCloudInstance.mqttCloudClient.publish(gwCloudInstance.publishMessages.register(),
			          		        jsonStr,publishOptionsR);
		console.log("publish register");	
	 }
})

gwCloudInstance.mqttCloudClient.on("reconnect",function(){
	log.Info(LOG_TAG_C,"RE-CONNECTED");
	if(gwCloudInstance.state == cloudConfig.STATE_INIT){
		//gwInstance.mqttCloudClient.publish(
		//	gwInstance.publishMessages.publish());	
	 }
})

gwCloudInstance.mqttCloudClient.on('message',function(topic, message, packet){
	var types = topic.split("/");
	var newPubTopic;
	var newSubTopic;
	var action;
	var actionCmd;
	console.log("cloud  Received topic:: message " +message  +"::" +types[cloudConfig.deviceIdIndex] +types[cloudConfig.deviceSubIdIndex]
									            +types[cloudConfig.deviceTypeIndex]	+types[cloudConfig.commandIndex]
										    );
	switch(types[cloudConfig.commandIndex]){
		case "ACCEPTED_FROM_MF_CLOUD":
			var SubsAction = gwCloudInstance.subscribeMessages.action();
			var SubsStatus = message +gwCloudInstance.subscribeMessages.status();
			log.Info(LOG_TAG,"Subscibe for action & status" +SubsAction +"::" +SubsStatus);
			gwCloudInstance.mqttCloudClient.subscribe(SubsAction);
			gwCloudInstance.mqttCloudClient.subscribe(SubsStatus);
			 /* //Test 
			var jsonStr=JSON.stringify(gJasonObject);
			var timer_id=setTimeout(function()
				 {
				  gwCloudInstance.mqttCloudClient.publish
				    (gwCloudInstance.publishMessages.status(),jsonStr,publishOptions);},5000);
			// */
				
			break;
		case "ACTION_FROM_MF_CLOUD":
			/* Message form cloud should be in format
			 * deviceId/SubId/Type/Status
			 */
			actionCmd = prepareCommandForDevice(message,"ACTION_TO_MF_GATEW");
			action = types[cloudConfig.deviceActionIndex];
			/* //Test 
			var jsonStr=JSON.stringify(gJasonObject);
			var timer_id=setTimeout(function()
				 {
				  gwCloudInstance.mqttCloudClient.publish
				    (gwCloudInstance.publishMessages.status(),jsonStr,publishOptions);},5000);
			// */
			sendActionFromCloudToGw(actionCmd,action);
			break;
		case "EMER_POWEROFF_FROM_MF_CLOUD":
			for(i=0; i<gwInstance.numberDeviceNodes; i++){
				message = "/" +gwInstance.deviceNodes[i].deviceId +"/" + gwInstance.deviceNodes[i].subDeviceId +"/" 
	    				  "/" +gwInstance.deviceNodes[i].deviceType;
				prepareCommandForDevice(message,"ACTION_TO_MF_GATEW");
				sendActionFromCloudToGw(message,"0");
			}
			break;	
		case "STATUS_FROM_MF_CLOUD":
			/* Message form cloud should be in format
			 * deviceId/SubId/Type/Status/
			 */
			prepareCommandForDevice(message,"STATUS_FROM_MF_GATEW");
			requestStatusFromDevice(statusCmd,types);
			break;
	}


})

function prepareCommandForDevice(msg,cmdType){
	var types,cmd;
	log.Info(LOG_TAG,"prepare cmd" +msg +cmdType)
	types = msg.split("/");
	searchForDeviceInDb(types,action);
	log.Info(LOG_TAG, +cmdType+"::" +types[cloudConfig.deviceIdIndex] +types[cloudConfig.deviceSubIdIndex]
				       			      +types[cloudConfig.deviceTypeIndex] +cmdType);
	cmd = "/" +types[cloudConfig.deviceIdIndex] +"/" +types[cloudConfig.deviceSubIdIndex] +"/" 
	      "/" +types[cloudConfig.deviceTypeIndex] + cmdType;
	return cmd;
}

function sendActionFromCloudToGw(actionCmd,action){
	log.Info(LOG_TAG,"Publish to device" +actionCmd +action);
	gwInstance.mqttDeviceClient.publish(actionCmd,action);
}
function sendDeviceStatusToCloud(message, mapping){
	log.Info(LOG_TAG,"status to cloud " +message +mapping);
	var jsonStr=JSON.stringify(gJasonObject);
	gwCloudInstance.mqttCloudClient.publish(gwCloudInstance.publishMessages.status(),jsonStr,publishOptions);
}
function requestStatusFromDevice(statusCmd,types){
	log.Info(LOG_TAG,"status request from GW " +statusCmd +types);
	gwInstance.mqttDeviceClient.publish(statusCmd,"REQSTATUS",publishOptions);
}

//////////////// Device Config/////////////////

var gwInstance = new gateway(config);
gwInstance.config(config);
gwInstance.localConnect(config);
gwInstance.allocateDeviceNodesMemory(config);
gwInstance.mqttDeviceClient.on("error",function(){
	log.Err(LOG_TAG,"CONNECT");
})
gwInstance.mqttDeviceClient.on("connect",function(){
	log.Info(LOG_TAG,"CONNECTED" +gwInstance.publishMessages.reset());
	if(gwInstance.state == 0){
		gwInstance.mqttDeviceClient.subscribe(gwInstance.subscribeMessages.register());
		gwInstance.mqttDeviceClient.publish(gwInstance.publishMessages.reset(),"Resetting",publishOptions);
	}
})

gwInstance.mqttDeviceClient.on("reconnect",function(){
	log.Info(LOG_TAG,"RE-CONNECTED");
	if(gwInstance.state == 0){
		//gwInstance.mqttDeviceClient.publish(
		//	gwInstance.publishMessages.publish());	
	 }
})

gwInstance.mqttDeviceClient.on('message',function(topic, message, packet){
	var types = topic.split("/");
	var newPubTopic;
	var newSubTopic;
	var newActionTopic;
	var mapping;
        console.log("Local Received topic is "+ topic +" message " +message  +"::" +types[config.deviceIdIndex] +types[config.deviceSubIdIndex]
	       					  			      	   +types[config.deviceTypeIndex] +types[config.commandIndex]);
	switch(types[config.commandIndex]){
		case "REGISTER_TO_MF_GATEW":
		        var node = searchOrAddNewDeviceNode(types, message);
			if( node != null){
				node.subId = types[config.deviceTypeIndex] + genarateSubId(types[config.deviceTypeIndex]);
				types[config.deviceSubIdIndex] = node.subId;
				mapping = searchForDeviceInDb(types,message);
				if(mapping){
				    mapping.subId = node.subId
				}
				log.Info(LOG_TAG,"New Device subId " +node.subId);
			}
			newSubTopic = createTopicFromDevice(types,config.deviceStatusSubs);
			newPubTopic = createTopicFromDevice(types,config.deviceRegistrationAcceptedSubs);
			newActionTopic = createTopicFromDevice(types, config.devicePublishMessageAction);
			if( node != null){
		       		console.log("Device subscribing to STATUS for device " +newSubTopic +"::" +newPubTopic);
				addSubDeviceTopicToNode(node,newSubTopic);
				gwInstance.mqttDeviceClient.subscribe(newSubTopic);
				addPubDeviceTopicToNode(node,newPubTopic);
				addPubDeviceTopicToNode(node,newActionTopic);
			}
			else{
				node = returnDeviceNode(types);
			}
			console.log("Device resposne" +newPubTopic +node.subId);
       			gwInstance.mqttDeviceClient.publish(newPubTopic,node.subId,publishOptions);
		      break;
		case "DEREGISTER_TO_MF_GATEW":
		      break;

		case "STATUS_TO_MF_GATEW":
		     console.log("got Status from device" +message +"::" +types);
		     searchAndUpdate(types,message);
		     break;

		case "EMER":
		     break;

		 default:
			console.log("undefiend message from device" +message +"::" +topic);
	}
		     
});

function createTopicFromDevice(types,cmd){
	var topic;
	topic = "/" + types[config.deviceIdIndex] +"/" + types[config.deviceSubIdIndex] +"/" +types[config.deviceTypeIndex] +"/" +cmd;
	return topic;
}

function genarateSubId(type){
	gwInstance.subIdCount++;
	return gwInstance.subIdCount;
}

function returnDeviceNode(types){
	var i;
	for(i=0; i<gwInstance.numberDeviceNodes; i++){
		if(
		   gwInstance.deviceNodes[i].deviceId == types[config.deviceIdIndex] &&
		   gwInstance.deviceNodes[i].subDeviceId == types[config.deviceSubIdIndex] &&
		   gwInstance.deviceNodes[i].deviceType == types[config.deviceTypeIndex]
		   )
		log.Info(LOG_TAG,"found" +types);
		return gwInstance.deviceNodes[i];
	}
	return null;
}

function searchOrAddNewDeviceNode(types, message){
	var i;
	for(i=0; i<gwInstance.numberDeviceNodes; i++){
		if(
		   gwInstance.deviceNodes[i].deviceId == types[config.deviceIdIndex] &&
		   gwInstance.deviceNodes[i].subDeviceId == types[config.deviceSubIdIndex] &&
		   gwInstance.deviceNodes[i].deviceType == types[config.deviceTypeIndex]
		   )
		log.Info(LOG_TAG,"found" +types);
		return null;
	}
	if(i >= gwInstance.numberDeviceNodes){
		log.Info(LOG_TAG, "new device" +types);
		deviceNode = new deviceConnection(types,config);
		deviceNode.config();
		gwInstance.deviceNodes[gwInstance.numberDeviceNodes]=deviceNode;
		gwInstance.numberDeviceNodes++;
		return deviceNode
	}
	return null;
}

function addSubDeviceTopicToNode(node,newTopic){
	node.subscribeMessages[node.numSubscribeMessages] = newTopic;
	node.numSubscribeMessages++;	
}
function addPubDeviceTopicToNode(node,newTopic){
	node.publishMessages[node.numPulishMessages] = newTopic;
	node.numPulishMessages++;
}

function matchDeviceInfo(mapping,type){
	if( mapping.id == type[config.deviceIdIndex] /*&&
	    mapping.subId == type[config.deviceSubIdIndex] &&
	    mapping.type == type[config.deviceTypeIndex]*/	    
	 )
		return 1;
	else
		return 0;
}

function searchForDeviceInDb(type,message){
	var deviceType = type[config.deviceTypeIndex];
	var i,j;
	//console.log("search" +subDeviceId  +deviceType +gJasonObject.GW.typeArray[0] +gJasonObject.GW.typeArray[1]);
	for(i=0; i< gJasonObject.GW.numType;i++){
		if(deviceType == gJasonObject.GW.typeArray[i]){
		   switch(deviceType){
			   case "LP":
			   for(j=0; j< gJasonObject.GW.LP.count;j++){
			       if( matchDeviceInfo(gJasonObject.GW.LP.mapping[j],type)){
				  log.Info(LOG_TAG,"searchForDeviceInDb device id found  " +type);
				  return gJasonObject.GW.LP.mapping[j];
			       }
			   }

			    case "FP":
			    for(j=0; j< gJasonObject.GW.FP.count;j++){
			       if( matchDeviceInfo(gJasonObject.GW.FP.mapping[j],type)){
				  log.Info(LOG_TAG,"searchForDeviceInDb device id found  " +type);
				  return gJasonObject.GW.FP.mapping[j];
			       }
			    }
			     case "AP":
			    for(j=0; j< gJasonObject.GW.AP.count;j++){
			       if(matchDeviceInfo(gJasonObject.GW.AP.mapping[j],type)){
				  log.Info(LOG_TAG,"searchForDeviceInDb device id found  " +type);
				  return gJasonObject.GW.AP.mapping[j];
			       }
			    }
		   }
		}
		else
		  log.Err(LOG_TAG,"deviceType NOT found" +type);
	}
	return false;
}
function parseStateFromCl(mapping){
	 return mapping.state
}
function searchAndUpdate(types, message){
	var newState,prevState;
	var mapping;
	mapping= searchForDeviceInDb(types,message);
	if(mapping){
	   prevState = parseStateFromCl(mapping);
	   if(message == "1")
		  mapping.state = "1";
	     else
		mapping.state = "0";
	    sendDeviceStatusToCloud(message,mapping);

	       /*
	       if(message == "0")
		    newState = "1";
	       else if(message == "1")
		    newState = "0";
	        console.log("updating state from"   +message +"to  " +newState);
		//Test
	       var timer_id=setTimeout(function(){gwInstance.mqttDeviceClient.publish("/LP/lp1/ACTION_TO_MF_GATEW",newState,publishOptions);},500);
	      */
	}
	else{
    		log.Err(" searchAndUpdate device id not found" +topic);
	}
   return mapping;
}

