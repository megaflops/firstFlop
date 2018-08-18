var Gpio = require('/home/pi/node_modules/onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 1000); //run the blinkLED function every 250ms

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
	console.log('turning LED OM');
	LED.writeSync(1);
	}
	else {
	console.log('turning LED OFF');
	LED.writeSync(0);
	}
}

function endBlink() { //function to stop blinking
   console.log(' End blink called ');
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 150000); //stop blinking after 5 seconds
//
