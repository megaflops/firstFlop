const http = require("http");
var work = 0;
var curr = -1;
var lastDateTime = "";
const server = http.createServer((req,res) => {
	var ledStat;
	console.log("New request" ); 
	console.log(req.url);
	if(req.url == "/api/on") {
		console.log(" i am on");
		work = 1;
		res.write("ON Request Received");
		res.write("\nLast handshake: " + 	lastDateTime);
		res.end();
	}
	else if(req.url == "/api/off") {
		console.log(" i am off");
		work = 0;
		res.write("OFF Request Received");
		res.write("\nLast handshake: " + 	lastDateTime);
		res.end();
	} 
	else if(req.url == "/api/status") {
		console.log(" Status CAll");
		//res.write("" + curr);
		if(curr == 1){
		  	res.write("LED Current Status:: ON");
			res.write("\nLast handshake: " + 	lastDateTime);
		}
		else if(curr ==0) {
			res.write("LED Current Status:: OFF");
			res.write("\nLast handshake: " + 	lastDateTime);
		}
		else {
			res.write("LED Current Status:: UNKNOWN");
			res.write("\nLast handshake: " + 	lastDateTime);
		}		
		res.end();
	}
	else if(req.url.startsWith("/api/workforme/") ) {
		console.log(" i got work");
		curr = parseInt(req.url.replace("/api/workforme/",""));
		console.log(" i got work request withStatus: " +curr);
		res.write(""+work);
		work = 2;
		var currentdate = new Date(); 
		lastDateTime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
		res.end();
	}
    	else {
		console.log(" i am else" );
		res.write(""+10);
		res.end();
		}
});

server.listen(5000);
console.log(" Server I am listing");
