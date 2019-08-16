/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
cl = require("./cloud");
//al = require("./alexaInterface");
const fs = require('fs');
var secure=0;

if(secure == 0){
var https=require('http');
var port = 50051;
}
else{
var https=require('https');
var port = 8013;
}
var jsonString;
var httpsServer;
var returnJson;
var fileName = "./json.txt";

var httpsHandler = function (request, response) {
    console.log("Received HTTPS request");
    if(request.method == 'POST') {
        console.log("Received POST" );
        jsonString = '';
         request.on('data', function (data) {
             jsonString += data;
             console.log("on data "+data);
         });
         request.on('end', function () {
         //console.log(gJasonObject.session.user);
         //console.log(gJasonObject.request);
         console.log("on end");
         console.log(jsonString);
         //writeJson(fileName);
         returnJson = cl.parseAndPrepareActionToGateway(jsonString);
         response.writeHead(200, "OK", {'Content-Type': 'app/json'});
         console.log("returnJson::");
         console.log(returnJson);
         //response.end(returnJson);
         response.end("rakesh");
         //writeJson("./jsonretun.txt");
        });
     }
     else {
         console.log("NO POST request");    
         response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
         response.end("rakesh no post");
     } 
};

function writeJson(lFileName){

    if(fs.existsSync(lFileName)) {
    //Show in green
    console.log('File exists. Deleting now ...');
    fs.unlinkSync(lFileName);
    }
    fs.writeFile(lFileName,jsonString,function(err){
        if(err){
        //response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        //response.end("Rakesh end F failure");
        }
        else{
        //response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        //response.end("Rakesh end F success ");
        }
    });
}
/*
var httpsHandler = function (req, res) {
  console.log("Received HTTPS request");
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello HTTPS World\n');
};

var httpOptions =  {
    key: fs.readFileSync("./privatekey1.pem"),
    cert: fs.readFileSync("./certificate1.pem")
}
*/
module.exports.alexaInterfaceInit = function(secure){
    if(secure == 1){
       console.log("Starting HTTPS server on port" +port);
       //httpsServer = https.createServer(httpOptions);
       httpsServer.addListener("request", httpsHandler);
       httpsServer.listen(port);
    }
    else{
        console.log("Starting HTTP server on port" +port);
        httpsServer = https.createServer();
        httpsServer.addListener("request", httpsHandler);
        httpsServer.listen(port);
    }
}

function localAlexaInterfaceInit(secure){
    if(secure == 1){
       console.log("Starting HTTPS server on port" +port);
       httpsServer = https.createServer(httpOptions);
       httpsServer.addListener("request", httpsHandler);
       httpsServer.listen(port);
    }
    else{
        console.log("Starting HTTP server on port" +port);
        httpsServer = https.createServer();
        httpsServer.addListener("request", httpsHandler);
        httpsServer.listen(port);
    }
}
/*
if(secure ==0 )
localAlexaInterfaceInit(0);
else
localAlexaInterfaceInit(1);
*/

