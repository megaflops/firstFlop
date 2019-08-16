// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const http = require('http');
const fs = require('fs');
var gActionJson= 
{
    "version":3,
    "cmdId":0xFFFF,
    "location":"roomxxxx",
    "name":"lightxxxx",
    "state":"xxxxxxxx",
    "commandType":"xxxxxx"
}

const data = JSON.stringify(gActionJson);

var local = 0;
if(local === 0){
  /*
  var options = {
    hostname: 'amber-techlab.com',
    port: '80',
    path: '/home/ambertechlab/rakesh/cloudSimulator/alexaInterface.js/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }*/
  var options = {
    hostname: 'ec2-34-204-12-140.compute-1.amazonaws.com', 
    port: '50051',
    path: '/test',
    method: 'POST',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    }
  }
}
/*
else{
  var options = {
    hostname: 'localhost',
    port: '50051',
    path: '/test',
    method: 'POST',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      }
  }
}*/

var returnJson={
  "version":3,
  "location":"xxxxxx",
  "locationName":"xxxxx",
  "name":"xxxxx",
  "nameas":"xxxx",
  "state":"xxxxx",
  "return":"failure",
  "commandType":"xxxxxxxxx"
};

function parseResposneFromCloud(responseString){
  var speechText,speechTextExt;
  console.log("response form cloud");
  var jsonObj = JSON.parse(responseString);
  if(jsonObj.return === "success") {
    if(jsonObj.commandType === "status"){
       speechText = " status of " +jsonObj.location  +"  " + jsonObj.name;
       speechTextExt = " which is" +"  "  +jsonObj.nameas +" in " +jsonObj.locationName +" is " +jsonObj.state;
       speechText = speechText+speechTextExt;
    }
    else{
      speechText = "truning " +jsonObj.state +"  "  +jsonObj.location +"  "  + jsonObj.name;
      speechTextExt = "  which is " +jsonObj.nameas +"  in  " +jsonObj.locationName;
      speechText = speechText+speechTextExt;
    }
  }
  else if(jsonObj.return === "samestate") {
      speechText =   "state of  " +jsonObj.location +"  "  + jsonObj.name;
      speechTextExt = "  which is" +"  "  +jsonObj.nameas +" in " +jsonObj.locationName +" is already " +jsonObj.state;
      speechText = speechText+speechTextExt;
  }
  else if(jsonObj.return === "no init"){
    speechText = " I am having trouble with initlization of gateway";
  }
  else {
     if(jsonObj.commandType === "status") 
      speechText = " I am having trouble with status of" +"  " +jsonObj.location +"  " + jsonObj.name;
     else
     speechText = " I am having trouble with turning " +"  " +jsonObj.state +"  " +jsonObj.location +"  " + jsonObj.name;
  }
  //console.log("Sppech" +speechText);
  return speechText;
}

async function  sendHTTPRequest(jsonString) {
  return new Promise(function(resolve, reject){
    var req = http.request(options,function (res) {
    var responseString = "";
    console.log('Status: ' + res.statusCode);
    console.log('Headers: ' + JSON.stringify(res.headers));
    res.on("data", function (resData) {
    responseString += resData;
    //console.log('on data: ' +resData);
    });
    res.on("end", function () {
        //console.log('on end ' +responseString);
        resolve(responseString);
    });
    res.on('error', function(e) {
      console.log('problem with response: ' + e);
      reject("error");
    });
   });
   req.on('error',function(err){
      console.log('problem with request: ' + err);
      reject("error");
   })
   req.on('timeout', function (socket) {
    console.log("on timeout");
    req.destroy();
   })
   console.log("sending data " +jsonString);
   req.write(jsonString);
   req.end();
 }).
  catch(error => {
    // Will not execute
    //console.log('caught new promise', error);
    return error;
  });
}

async function sendAndWait(json){
  var speech;
  var myPromise = sendHTTPRequest(json);
  var result = await myPromise;
  if(result === "error"){
    console.log("Promise failure" , result);
    speech = "Sorry I am having trouble connecting";
  }
  else{
    console.log("Promise success" , result);
    speech = parseResposneFromCloud(result);
    console.log("Say: " +speech);
  }
}

function createActionJson(state,roomName, roomNum,lightName,lightNUmber){
  console.log("Data"  +state +roomName +roomNum +lightName +lightNUmber );
  if(typeof roomName  === 'undefined')
    gActionJson.location = "NA";
  else{
    if(typeof roomNum === 'undefined')
      gActionJson.location  =  roomName;
    else 
      gActionJson.location  = roomName + roomNum;
  }
  if(typeof lightName === 'undefined')
    gActionJson.name = "NA";
  else{
      if(typeof lightNUmber === 'undefined')
        gActionJson.name  =  lightName;
      else 
        gActionJson.name  = lightName + lightNUmber;
  }
  if(typeof state === 'undefined'){
    gActionJson.state = "NA";
    gActionJson.commandType = "status";
  }
  else{
   gActionJson.state = state;
   gActionJson.commandType = "action";
  }
  console.log("creating json" +JSON.stringify(gActionJson));
  return JSON.stringify((gActionJson));
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome, you can say Hello or Help. Which would you like to try?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const MeraGharGateWayIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'MeraGharGateWayIntent';
    },
    async handle(handlerInput) {
        console.log("Sending http request");
        //console.log(handlerInput.requestEnvelope.request);
        var json = createActionJson(
          handlerInput.requestEnvelope.request.intent.slots.state.value,
          handlerInput.requestEnvelope.request.intent.slots.roomType.value,
          handlerInput.requestEnvelope.request.intent.slots.roomID.value,
          handlerInput.requestEnvelope.request.intent.slots.lightType.value,
          handlerInput.requestEnvelope.request.intent.slots.lightID.value,
        );
          
        const myPromise =  await sendHTTPRequest(json);
        var result = myPromise;
        var speech;
        //console.log("Promise enter" , result);
        if(result === "error"){
            console.log("Promise failure" , result);
            speech = "I am having trouble connecting with gateway"
        }
        else{
            console.log("Promise success" , result);
            speech = parseResposneFromCloud(result);
            console.log("Say: " +speech);
        }
        console.log('return from http');
        //const speechText = 'My Home command received';
        return handlerInput.responseBuilder
            .speak(speech)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hello Rakesh World!';
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        MeraGharGateWayIntentHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();

