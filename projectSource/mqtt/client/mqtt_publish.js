var mqtt=require('mqtt');


options={
clientId:"mqttjs01",
clean:true};

var client = mqtt.connect("mqtt://172.16.4.173:3000",{clientId:"mqttjs01"});
//handle incoming messages
client.on('message',function(topic, message, packet){
	console.log("Received message is "+ message);
	console.log("Received topic is "+ topic);
});

client.on("connect",function(){	
console.log("connected  " +client.connected);
})

//Handle Error
client.on("error",function(error){
console.log("Can't connect" + error);
process.exit(1)});

//publish function
function publish(topic,msg,options){
  console.log("## Publishing",msg);
  if (client.connected == true){
   client.publish(topic,msg,options);}
   else {
	  console.log(" publishing Connect error" +client.connected);
   }
}

var options={
retain:true,
qos:1};

var topic="testtopic";
var message="test message";
var topic_list=["topic2","topic3","topic4"];
var topic_o={"topic22":0,"topic33":1,"topic44":1};
console.log("subscribing to topics");
client.subscribe(topic,{qos:1}); //single topic
client.subscribe(topic_list,{qos:1}); //topic list
client.subscribe(topic_o); //object

console.log("connecting to 37.187.106.16:1883");
var timer_id=setInterval(function(){publish(topic,message,options);},10000);
//notice this is printed even before we connect
//console.log("end of script");
