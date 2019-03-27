var https = require('https');
const crypto = require('crypto');
var fs    = require('fs');
var port = 1443;
/*
var privateKey = fs.readFileSync('amber/privatekey.pem').toString();
var certificate = fs.readFileSync('amber/certificate.pem').toString();
var credentials = crypto.createCredentials({key: privateKey, cert: certificate});
var gJasonObject ='';

var httpsHandler = function (request, response) {
  console.log("Received HTTPS request" +request);
  if(request.method == 'POST') {
       console.log("Received POST" );	  
       var jsonString = '';
        request.on('data', function (data) {
            jsonString += data;
        });
        request.on('end', function () {
            gJasonObject = JSON.parse(jsonString);
	    console.log(gJasonObject.session.user);
	    console.log(gJasonObject.request);
        });
	response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        response.end("Rakesh");
    } else {
	console.log("NO POST request");    
        response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        response.end("rakesh");
    }
};

var server = https.createServer(httpOptions);
//server.setSecure(credentials);
console.log("Creating server and listining on" +port);
server.addListener("request", httpsHandler);
server.listen(port);
*/

var httpOptions =  {
 key: fs.readFileSync("amber/privatekey1.pem"),
 cert: fs.readFileSync("amber/certificate1.pem")
}

var httpsHandler = function (req, res) {
  console.log("Received HTTPS request");
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello HTTPS World\n');
};

console.log("Starting HTTPS server on port" +port);
var httpsServer = https.createServer(httpOptions);
httpsServer.addListener("request", httpsHandler);
httpsServer.listen(port);
/*
var httpServer = http.createServer();
httpServer.addListener("request", httpHandler);
httpServer.listen(8002);
*/

