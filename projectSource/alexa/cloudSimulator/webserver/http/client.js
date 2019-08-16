http = require('http');
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

var local = 1;
if(local == 0){
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
    hostname: 'ec2-18-204-201-5.compute-1.amazonaws.com',
    port: '50051',
    path: '/test',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }
}
else{
  var options = {
    hostname: 'localhost',
    port: '50051',
    path: '/test',
    method: 'POST',
    timeout: 6000,
    headers: {
      'Content-Type': 'application/json',
      }
  }
}


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
  var jsonObj;
  try {
        var jsonObj = JSON.parse(responseString);
        // if came to here, then valid
  } catch(e) {
        // failed to parse
        console.log("validateJason failed to parse json");
        return null;
  }
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

function mysleep(millis) {
  return new Promise(function (resolve, reject) {
      setTimeout(function () { resolve(); }, millis);
  });
}

async function main(){
  var jsonStr = createActionJson("off","room", "1", "light","2");
  sendAndWait(jsonStr);
  console.log("sendAndWait end");
  await mysleep(5000);
  console.log("function end");
}

main();
