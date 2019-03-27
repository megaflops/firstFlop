
var https = require('http');
//var fs = require('fs');

console.log("Starting web server at 8000");
https.createServer(function (req, res) {
  console.log("received request ");
  console.log(req.header);
 if(req.method == "POST"){
		var body = ' ';
		console.log(req.headers);
		req.on('data', function (data) {
			body += data;
			//console.log("Partial body:" + body.toString('hex'));
			console.log("Partial body:" + body);
		});
 		req.on('end', function () {
            console.log("Body:" + body);
        });
	}
  res.writeHead(200);
  res.end(" OK \n");
}).listen(8000);
