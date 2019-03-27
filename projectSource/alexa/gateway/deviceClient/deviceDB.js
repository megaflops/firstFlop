var log=require('../../common/trace');
LOG_TAG_DB = "DeviceDB";
function deviceDBClass(config,index){
    this.deviceID=config.deviceID;
    this.location=config.attributes.location;
    this.locationName=config.attributes.locationName;
    this.devTypeName=config.thingName;   
    this.as=config.attributes.connections[index].as;
    /* state is on/off type or scale 1-10 etc*/
    this.state=config.attributes.connections[index].state;
    this.subTypeName=config.attributes.connections[index].subTypeName;
	this.currentState=config.attributes.connections[index].currentState;
	this.requestedState=config.attributes.connections[index].requestedState;
    this.lastUpdated=config.attributes.connections[index].lastUpdated;
    this.connectionIndex = index;
    this.connectionJson = getConnectionIndexJason(config,index);
}
module.exports=deviceDBClass;
/* here I want to store connection index in a device array index.
as  device of type switch board, will have multiple connection type (
i.e fan, light, socket etc)
so Single device ID will hold multiple index entries in Device array
one for each sub type.
I want to store connection field sub jason of device JASON 
e.g.
connections": [
          { "state":"on/off", "as":"light2","subTypeName":
             "tubeLight","rating":"6a","currentState":"off","requestedState":"off","lastUpdated":"0"}
        ]
*/
function getConnectionIndexJason(jason,index){
        var subjason = JSON.stringify(jason.attributes.connections[index]);
        log.Info(LOG_TAG_DB,"Sub jason " +subjason +" index " +index);
        return subjason;
}   