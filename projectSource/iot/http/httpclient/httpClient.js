var Gpio = require('/home/pi/node_modules/onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
//var blinkInterval = setInterval(blinkLED, 1000); //run the blinkLED function every 250ms
var ledState;

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off) 
    console.log(' turning LED OM');	  
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
    console.log(' turning LED OFF');
  }
}
function LEDOnOff(isON) {
	if(isON){
	console.log('turning LED ON');
	LED.writeSync(1);
	ledState = 1;
	}
	else {
	console.log('turning LED OFF');
	LED.writeSync(0);
	ledState =0;
	}
}

function endBlink() { //function to stop blinking
   console.log(' End blink called ');
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

//setTimeout(endBlink, 50000); //stop blinking after 5 seconds
//
const http = require("http");

const server = http.createServer((req,res) => {
	var ledStat;
	console.log("New request" );
	if(req.url == "/api/on") {
		console.log(" i am on");
		LEDOnOff(true);
		res.write("ON OK");
		res.end();
	}
	else if(req.url == "/api/off") {
		console.log(" i am off");
		LEDOnOff(false);
		res.write("OFF OK");
		res.end();
	}
    	else if(req.url == "/api/off") {
		console.log(" i am Status");
		if(LED.readSync() == 0){
		    console.log(" Status is OFF");
		    ledStat = 0;
		}
		else{
		   console.log(" Status is ON");
		   ledStat = 1;
		}
		res.write("STATUS OK" +ledStat);
		res.end();
	      }
	else {
		console.log(" i am else");
		console.log(req.url);
		//LEDOnOff(true);
		res.write("ELSE ERR");
		res.end();
		}
});

//server.listen(4000);

LEDOnOff(false);
var ledState = LED.readSync();

//console.log("Listening at port 4000");
//
//      HTTP Client
//
//
var https = require('http');
 
var reqInterval = setInterval(getCall, 2000); //run the  function every 5 sec

function getCall() {
    console.log("making http request");
    //initialize options values, the value of the method can be changed to POST to make https post calls
    var userAccessToken = 'MYIOT' 
//'CAAKoIMGu5SAyfOyVhugi7cZAaZA1kHzjrdLvtPlndoKzMJ8xZBtR3YV2iX39FSnhxK1lvtfYXO5FvcbK4MVGJphxeYDZC7HJ5FCmhOr2Ys8ZBG9qYNRSfFGuzoeRgwZBdliKvoW6YPl41b8i3dfrTpR98gFAm6qag9vYM2yD0aEv47fnWQWF1SoXRs6PFFrFu5XOe';
    var appAccessToken = 'CMDFORME' 
 //'24562343562751562|hPEXIpDl0CXt0tNJ';
    var options = {
        host :  '192.168.0.108',
        port : 5000,
        path : '/api/workforme/' +ledState,
        method : 'GET'
    }
    //making the https get call
    console.log(" HTTP REQ::" +ledState);
    var getReq = http.request(options, function(res) {
        console.log(" status code: ", res.statusCode);
        res.on('data', function(data) {
            console.log( JSON.parse(data));
	     execute(JSON.parse(data));
	});
	
	res.on('error', function(data) {
	    console.log("ERROR");	
            console.log( JSON.parse(data) );    
        });
    });
    //end the request
    getReq.end();
    getReq.on('error', function(err){
    console.log("Error: ", err);
    }); 
}
 
function execute(code){
	if(code == 0){
	   console.log(" make me off");
	   LEDOnOff(false);
	}
	else if(code == 1){
	   console.log(" make me on");
	   LEDOnOff(true);
	}
	else if(code == 2){
	   console.log(" No work");
	   //LEDOnOff(true);
	}
	else{
	   console.log(" Invalid cmd");
	 }
}

//getCall();
