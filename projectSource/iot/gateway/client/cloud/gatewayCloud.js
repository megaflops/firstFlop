var mqtt=require('../../../../mqtt/client/node_modules/mqtt');
var cloudComp = require("./cloudClassesDecs.js");
var gwConnection = require("./gwClassesDecs.js");
var log = require('../trace');
var cloudConfig=require("./cloudConfig");
var fs = require('fs');
var gJasonObject;

//////////////////////////////////
//const express = require('express');
//const app = express();
var json;

function gatewayStatus(data) {
	if(topicMessageFromGwId(gTestGwId) == 1)
	   return 1;
	return new Promise(pResolve,pReject)
	console.log("Received JSON" +json);
	return json;
}

function actionToGateway(gateway,data) {
	//Call Action
	sendActionToGw(gateway,data);
	var timer_id=setTimeout(function()
	 {
	    log.Info("Sending failure to promise");
	    pReject(gJasonObject);

	 },10000);
	//Promise wait for Status
	return new Promise(pResolve,pReject);
}

/*
function funcC(data) {
	return data.length * 100 + "";
}

app.get('/api/iot/:id', (req, res) => {
    var ret = "";
    		console.log("##" +req.params.id +"gatewayStatus".localeCompare(req.params.id));
		//gatewayStatus
		if( 0 == "gatewayStatus".localeCompare(req.params.id)) {
			ret = gatewayStatus(req.query.p);
		} else if( 0 == "actionTogateway".localeCompare(req.params.id)) {
			ret = actionTogateway(req.query.p);
		} else if( 0 == "funcC".localeCompare(req.params.id)) {
			ret = funcC("Test");
		} else {
			ret = 'API is not present';
		} 			
		res.send(ret);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listen on port ${port}...`));
/////////////////////////////////////
*/
var LOG_TAG="CLOUD"
var publishOptions={
	retain:false,qos:1
}

//////////// Cloud Config /////////////////////
var cloudInstance = new cloudComp(cloudConfig);
cloudInstance.config(cloudConfig);
cloudInstance.cloudConnect(cloudConfig);
cloudInstance.allocateGatewayNodesMemory(cloudConfig);
cloudInstance.mqttCloudClient.on("error",function(){
log.Err(LOG_TAG,"CONNECT");
})

cloudInstance.mqttCloudClient.on("connect",function(){
	log.Info(LOG_TAG,"CONNECTED");
	if(cloudInstance.state == cloudConfig.STATE_INIT){
		cloudInstance.mqttCloudClient.subscribe(cloudInstance.subscribeMessages.register());
		console.log("subscribe register");
	 }
})

cloudInstance.mqttCloudClient.on("reconnect",function(){
	log.Info(LOG_TAG,"RE-CONNECTED");
	if(cloudInstance.state == cloudConfig.STATE_INIT){
		cloudInstance.mqttCloudClient.subscribe(cloudInstance.subscribeMessages.register());
		console.log("subscribe register again");	
	 }
})

function createTopicForGw(types,cmdType){
	var cmd;
	//searchForDeviceInDb(types,action);
	log.Info(LOG_TAG, cmdType +"::" +types[cloudConfig.gwIdIndex] +types[cloudConfig.gwSubIdIndex]
				       			      +types[cloudConfig.gwTypeIndex] +cmdType);

	cmd = "/" +types[cloudConfig.gwIdIndex] +"/" +types[cloudConfig.gwSubIdIndex] +"/" +types[cloudConfig.gwTypeIndex] +"/"+cmdType;
	return cmd;
}

function createTopicForGwFromNode(node,cmdType){
	var cmd;
	cmd ="/" + node.HwId +"/" +node.myId + "/" + npde.myType + "/" +cmdType; 
}

cloudInstance.mqttCloudClient.on('message',function(topic, message, packet){
	var types = topic.split("/"); 
	var newPubTopic;
	var newSubTopic;
	log.Info(LOG_TAG,"cloud  Received topic is "+ topic +"::" +types[cloudConfig.gwIdIndex] );
	switch(types[cloudConfig.commandIndex]){
		case "REGISTER_TO_MF_CLOUD":
			log.Info(LOG_TAG,"Subscibe for status" +cloudConfig.gwStatusSubs +cloudConfig.gwRegistrationAcceptedSubs +cloudConfig.gwActionPub);
			//Store in Json recioved
			var SubsDeviceStatus = createTopicForGw(types,cloudConfig.gwStatusSubs);
			var pubAccept =        createTopicForGw(types,cloudConfig.gwRegistrationAcceptedSubs);
			var pubAction =        createTopicForGw(types,cloudConfig.gwActionPub);
			log.Info(LOG_TAG, ":::" +command);
			gJasonObjectString = message;
			gJasonObject = JSON.parse(message);
			//Add command to cloud node
			var node = searchOrAddNewGwNode(types);
			var pubStatus = createTopicForGwFromNode(node,cloudConfig.gwStatusSubs);         
			var pubStatus=         
			if(node !== null){
				addSubGwTopicToNode(node,SubsDeviceStatus,node.SubStatusIndex);
				addPubGwTopicToNode(node,pubAccept,node.RegAcceptIndex);
				addPubGwTopicToNode(node,pubAction,node.RegActionIndex);
				addPubGwTopicToNode(node,pubStatus,node.RegStatusIndex);
				createEndDeviceListFromJson(node,gJasonObject);
			}
			cloudInstance.mqttCloudClient.subscribe(SubsDeviceStatus);
			log.Info(LOG_TAG,"publish accept" +pubAccept +"::" +command +"::" +SubsDeviceStatus);
			cloudInstance.mqttCloudClient.publish(pubAccept,command,publishOptions);
			gTestGwId=topic;
			//Test
			
			  /*setInterval( function() {
				       testStatus(gTestGwId);
			  	  }, 10000);*/
			  
				var timer_id=setTimeout(function()
				 {
				    testStatus(gTestGwId);
				 },10000);
			break;

		case "STATUS_TO_MF_CLOUD":
			gJasonObjectString = message;
			gJasonObject = JSON.parse(message);
			log.Info(LOG_TAG,"Received status from GW" +types[cloudConfig.gwIdIndex] +message);
			node=getGatewayNode(types);
			createEndDeviceListFromJson(node,gJasonObject);
			log.Info("Status Sending success to promise");
			pResolve(gJasonObject);
			break;

		default:
			log.Info(LOG_TAG,"wrong cmd index");
			break;
	}
})

function testOnOFf(gateway){
	var i;
	var newState;
	var message;
	var types = gateway.split("/");
	var node = getGatewayNode(types);
        if(node){
		  topic = node.publishMessages[RegActionIndex];
 		  for(i=0; i<node.numEndDevice ; i++) {
			var types =  node.endDeviceList[i].slpit("/");
			log.info(LOG_TAG, +node.endDeviceList[i] +"::" +types[3] +tpyes[4]);
			if(types[4] == "0")
				newState = "1";
			else
				newState = "0";
			topicMessageFromGwId(gateway,i,newState);
		}
	}
}
function testStatus(gateway){
	topicMessageFromGwId(gateway,0,"STATUS");
	topicMessageFromGwId(gateway,1,"STATUS");
}

function topicMessageFromGwId(gateway,index,option) {
	var i;
	var message;
	var types = gateway.split("/");
	var node = getGatewayNode(types);
	 if(node){
		 if(index > node.numEndDevice)
			return 1;
		 if(option == "STATUS"){
			topic = node.publishMessages[RegStatusIndex];
			message = node.endDeviceList[index] +option + "/";
		 }
		 else {
			topic = node.publishMessages[RegActionIndex];
			message = node.endDeviceList[index];
		 }
		log.Info(LOG_TAG, +option +topic +message);
		publishToGateway(topic,message);
		}
	 }
	 else{
		log.Err(LOG_TAG,"Status: GW not found in DB" +gateway);
		return 1;
	 }
	return 0;
}

function publishToGateway(topic,message){
 	cloudInstance.mqttCloudClient.publish(topic,message,publishOptions);
 	return gJasonObjectString;
}

function getGatewayNode(types){
	var i;
	for(i=0; i<cloudInstance.numberGwNodes; i++){
		console.log("##" +cloudInstance.gwNodes[0].deviceId +cloudInstance.gwNodes[0].subDeviceId  +cloudInstance.gwNodes[0].deviceType);
		console.log("##" + types[cloudConfig.gwIdIndex] +types[cloudConfig.gwSubIdIndex] +types[cloudConfig.gwTypeIndex]);
		if( cloudInstance.gwNodes[i].deviceId    == types[cloudConfig.gwIdIndex] &&
		    cloudInstance.gwNodes[i].subDeviceId == types[cloudConfig.gwSubIdIndex] &&
		    cloudInstance.gwNodes[i].deviceType  == types[cloudConfig.gwTypeIndex]
		   ) {
			log.Info(LOG_TAG,"GW found" +types);
			return cloudInstance.gwNodes[i];
		   }
	}
	log.Info(LOG_TAG,"GW NOT found" +types +cloudInstance.gwNodes[0] +"::" +i);
	return null;
}

function searchOrAddNewGwNode(types){
	var i;
	for(i=0; i<cloudInstance.numberGwNodes; i++){
		if( cloudInstance.gwNodes[i].deviceId == types[cloudConfig.gwIdIndex] &&
		   cloudInstance.gwNodes[i].subDeviceId == types[cloudConfig.gwSubIdIndex] &&
		   cloudInstance.gwNodes[i].deviceType == types[cloudConfig.gwTypeIndex]
		   )
		log.Info(LOG_TAG,"found" +types);
		return null;
	}
	if(i >= cloudInstance.numberGwNodes){
		log.Info(LOG_TAG, "new GW" +types);
		gwNodes = new gwConnection(types,cloudConfig);
		gwNodes.config();
		cloudInstance.gwNodes[cloudInstance.numberGwNodes]=gwNodes;
		cloudInstance.numberGwNodes++;
		return gwNodes;
	}
	return null;
}

function addSubGwTopicToNode(node,newTopic,index){
	node.subscribeMessages[index] = newTopic;
	node.numSubscribeMessages++;	
}
function addPubGwTopicToNode(node,newTopic,index){
	node.publishMessages[index] = newTopic;
	node.numPulishMessages++;
}
function matchDeviceInfo(mapping,type){
	if( mapping.id == type[cloudConfig.deviceIdIndex] &&
	    mapping.subId == type[cloudConfig.deviceSubIdIndex] &&
	    mapping.type == type[cloudConfig.deviceTypeIndex]	    
	 )
		return 1;
	else
		return 0;
}
function createTopicFromDb(mapping,deviceType){
	var topic = "/" +mapping.id  +"/" +mapping.subId 
		+"/" +deviceType +"/";
       return topic;
}
function searchForDeviceInDb(type){
	var deviceType = type[cloudConfig.deviceTypeIndex];
	var i,j;
	for(i=0; i< gJasonObject.GW.numType;i++){
		if(deviceType == gJasonObject.GW.typeArray[i]){
		   switch(deviceType){
			   case "LP":
			   for(j=0; j< gJasonObject.GW.LP.count;j++){
			       if(matchDeviceInfo(gJasonObject.GW.LP.mapping[j],type)){
				  console.log("searchForDeviceInDb deice id found  " +type);
				  return gJasonObject.GW.LP.mapping[j];
			       }
			   }

			    case "FP":
			    for(j=0; j< gJasonObject.GW.FP.count;j++){
			       if(matchDeviceInfo(gJasonObject.GW.FP.mapping[j],type)){
				  log.i("searchForDeviceInDb deice id found  " +type);
				  return gJasonObject.GW.FP.mapping[j];
			       }
			    }
			     case "AP":
			    for(j=0; j< gJasonObject.GW.AP.count;j++){
			       if(matchDeviceInfo(gJasonObject.GW.AP.mapping[j],type)){
				  log.i("searchForDeviceInDb deice id found  " +type);
				  return gJasonObject.GW.AP.mapping[j];
			       }
			    }
		   }
		}
		else
		  console.log("deviceType NOT found" +type);
	}
	return false;
}

function parseStateFromCl(mapping){
	 return mapping.state
}
function createEndDeviceListFromJson(node,json){
	//var deviceType = type[cloudConfig.deviceTypeIndex];
	var i,j;
	cloudInstance.numEndDevice=0;
	for(i=0; i< gJasonObject.GW.numType;i++){
		 var deviceType = gJasonObject.GW.typeArray[i];
		   switch(deviceType){
			   case "LP":
			   for(j=0; j< gJasonObject.GW.LP.count;j++){
				log.Info(LOG_TAG,"@@@@" +createTopicFromDb(gJasonObject.GW.LP.mapping[j],deviceType));
				node.endDeviceList[node.numEndDevice++]=createTopicFromDb(gJasonObject.GW.LP.mapping[j],deviceType);
				log.Info(LOG_TAG,"Adding device type LP" +node.endDeviceList[node.numEndDevice-1]
										+node.numEndDevice);
			     }
			     break;
			     /*
			    case "FP":
			    for(j=0; j< gJasonObject.GW.LP.count;j++){
			      node.endDeviceList[node.numEndDevice++]=createTopicFromDb(gJasonObject.GW.FP.mapping[j],deviceType);
			      log.Info(LOG_TAG,"Adding device type FP" +node.numEndDevice);
			    }
			    break;
			     case "AP":
			    for(j=0; j< gJasonObject.GW.LP.count;j++){
			       node.endDeviceList[node.numEndDevice++]=createTopicFromDb(gJasonObject.GW.AP.mapping[j],deviceType);
			       log.Info(LOG_TAG,"Adding device type AP" +node.numEndDevice);
			       }*/
			    }
		  
	}
}

