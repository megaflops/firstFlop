
// code for api call received from cloud broker

/*  URl format

Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?page=1&something=6',
  query: 'page=1&something=6',
  pathname: '/about',
  path: '/about?page=1&something=6',
  href: '/about?page=1&something=6' }
  */

  var http = require('http'); 
  var url = require('url'); 
  var router = require('./router');
  const fs = require('fs');
  let configFilePath = "/configs/apiConfigs.txt";
  let iotConfig = "configs/iotConfigs.txt"

  var configData = fs.readFileSync(path,'utf8');
  console.log(configData);

  var server = http.createServer(function(req,res){
  res.writeHead("200");
  router.checkGatewayRoute(req);
  res.end("end"); 
 }); 

server.listen(5000); 
console.log("Gateway server is listening on port 5000..."); 


var server = http.createServer(function(req,res){
  res.writeHead("200");
  router.checkNodeServerRoute(req);
  res.end("end"); 
 }); 
server.listen(6000); 
console.log("js server is listening on port 6000..."); 


var router = {
  checkRoute : function(req){
      var parsedURL = url.parse(req.url); 
      var parsedPathname = parsedURL.pathname;
      var parsedSearch = parsedURL.search;
      var parsedquery = parsedURL.query;
      var parsePath = parsedURL.path;
     console.log(" Parsed URL" +parsedPathname +parsedquery +parsedSearch +Parsed);
    }

  checkRoute : function(String apiwithParams){
    var fnPtr = apiWithParams
    var parmas[] = apiWithParams
      /*fs.readFile(path,function)(error,data) {
      if(error){
        console.log("file Error :" +error);
      }
    }
    */
    var result = verifyParams(fnPtr, params,configData);
    if(result){
      console.log("api verification fail" +fnptr,+parama,+data);
    }
    else{
      console.log("Calling API" +fnprt "with params" +params);
      //Async call

    }
    
  }
  }
  module.exports = router;

