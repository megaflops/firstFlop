
testJson = 
{
    "version": 3,
     "thingName": "switch",
     "deviceID": "12345",
     "thingSubTypeName": "switch",
     "attributes": {
         "model": "123",
         "brand":"Amber",
         "location":"room3",
         "locationName":"childernRoom",
         "numConnections":3,
         "connections": [
          { "state":"on/off", "as":"light2","subTypeName":
             "tubeLight","rating":"6a","currentState":"off","requestedState":"off","lastUpdated":"0"
          },
          { "state":"on/off", "as":"light3","subTypeName":
             "ledLight","rating":"6a","currentState":"off","requestedState":"off","lastUpdated":"0"
          },
          { "state":"sacle", "as":"fan1","subTypeName":
             "fan","rating":"6a","currentState":"10","requestedState":"5","lastUpdated":"0"
          }
        ]
  }
}

gwDevicesJason = {
    "gatewayID":"error",
    "gatewayNameType":"error",
    "numberLocations": 1
     "locations":[ 
                    {
                        "name":"room1",
                        "locationName":"guestRoom",
                        "numberDevices":"1",
                        "devices": [ {
                                    "as":"light2",
                                    "state":"on/off",
                                    "subTypeName":"ledBulb",
                                    "currentState":"off",
                                    "requestedState":"on"
                                     },
                                 ]
                    }
                ]
}

function test(){
    deviceManagerInit1();
    testcreareDB();
    generateJasonFromDeviceDB();
    testPrintDeviceJSON();
}

function testPrintDeviceJSON(){
    var i,j;
    console.log(gwDevicesJason.gatewayID);
    console.log(gwDevicesJason.gatewayNameType);
    for(i=0 ; i < gwDevicesJason.numberLocations; i++){
            console.log(gwDevicesJason.locations[i].name);
            console.log(gwDevicesJason.locations[i].locationName);
            for(j=0; j< gwDevicesJason.locations[i].numberDevices;j++){
                console.log("###Leaf node##");
                console.log(gwDevicesJason.locations[i].devices[j].as);
                console.log(gwDevicesJason.locations[i].devices[j].subTypeName);
                console.log(gwDevicesJason.locations[i].devices[j].currentState);
                console.log(gwDevicesJason.locations[i].devices[j].requestedState);
            }
    }
    var str = JSON.stringify(gwDevicesJason);
    console.log(str);
}

function testcreareDB()
{
    var i,numEntries=0;
    var jObj = JSON.parse(JSON.stringify(testJson));
    while(numEntries < jObj.attributes.numConnections){
        log.Info(LOG_TAG_DM,"new device found " +jObj.deviceID);
        var deviceDbObj = new deviceDb(jObj,numEntries);
        gwInstance.deviceArray.push(deviceDbObj);
        numEntries++;
    }
    
    for(i=0; i<jObj.attributes.numConnections ; i++){
        console.log( gwInstance.deviceArray[i].location);
        console.log( gwInstance.deviceArray[i].locationName);
        console.log( gwInstance.deviceArray[i].as);
        console.log( gwInstance.deviceArray[i].subTypeName);
        console.log( gwInstance.deviceArray[i].requestedState);

    }
}