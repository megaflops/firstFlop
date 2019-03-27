#include <Arduino.h>
#include <ArduinoJson.h>
#include "EspLightPoint.h"
#include "espJason.h"
#include "esplog.h"
#define LOG_TAG  "espJSON"
 void  printJson1();
char gDeviceJson[] = 
"{\
    \"version\": 3, \
     \"thingName\": \"xxxxxxx\", \
     \"deviceID\": \"xxxxxxxxxxxxxxxxxxxxxxxxxxxx\", \
     \"thingSubTypeName\": \"switch\", \
     \"attributes\": { \
         \"model\": \"123\", \
         \"brand\":\"Amber\", \
         \"location\":\"room1\", \
         \"locationName\":\"guestRoom\", \
         \"numConnections\":2, \
         \"connections\": [ \
          { \"state\":\"on/off\", \"as\":\"light2\",\"subTypeName\": \
             \"tubeLight\",\"rating\":\"6a\",\"currentState\":\"off\",\"requestedState\":\"off\",\"lastUpdated\":\"0\"},\
          { \"state\":\"on/off\", \"as\":\"light3\",\"subTypeName\": \
             \"NightLamp\",\"rating\":\"6a\",\"currentState\":\"off\",\"requestedState\":\"off\",\"lastUpdated\":\"0\" \
          } \
        ]\ 
  }\
}";

char gDeviceJsonArray[1024];
char gDeviceJsonArray1[1024];

int updateDeviceJason(ActionJson*actionJson , int *ledIndex){
      const char *strPtr=NULL;
      int i;
      StaticJsonDocument<1024> doc;
      DeserializationError error = deserializeJson(doc,gDeviceJsonArray);
      if (error) {
        logInfo(LOG_TAG,F("deserializeJson() failed: "));
        logInfo(LOG_TAG,error.c_str());
        return -1;
     }
      const char *locationPtr = doc["attributes"]["location"];
      logInfo(LOG_TAG,strPtr);
      int index = doc["attributes"]["numConnections"];
      if( !strcmp(locationPtr,actionJson->location)){
          for(i=0 ; i<index; i++){
            strPtr = doc["attributes"]["connections"][i]["as"];
            if(!strcmp(strPtr,actionJson->name)){
                logInfo(LOG_TAG,"Location & name Matched");
                logInfo(LOG_TAG,"Current & Requested State & action state");
                strPtr = doc["attributes"]["connections"][i]["currentState"];
                logInfo(LOG_TAG,strPtr);
                strPtr = doc["attributes"]["connections"][i]["requestedState"];
                logInfo(LOG_TAG,strPtr);
                logInfo(LOG_TAG,actionJson->state);
                /* UPdate device state*/
                doc["attributes"]["connections"][i]["currentState"]=actionJson->state;
                serializeJson(doc,gDeviceJsonArray1,1024);
                memcpy(gDeviceJsonArray,gDeviceJsonArray1,1024);
                *ledIndex=i;
                printJson1();
                return 0;
              }
            else{
              logInfo(LOG_TAG,"name mismatch");
              logInfo(LOG_TAG,actionJson->name);
              logInfo(LOG_TAG,strPtr);
            }       
            }
      }
      else{
        logInfo(LOG_TAG,"Location mismatch");
        logInfo(LOG_TAG,actionJson->location);
      }
      serializeJson(doc,gDeviceJsonArray1,1024);
      memcpy(gDeviceJsonArray,gDeviceJsonArray1,1024);
      printJson1();
      return 1;
}

int parseJsonForAction(const char* jasonStr, ActionJson *actionJson,int length){
  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc,jasonStr);
  if (error) {
    logInfo(LOG_TAG,F("deserializeJson() failed: "));
    logInfo(LOG_TAG,error.c_str());
    return -1;
  }
  const char *strPtr;
  int a;
  a=doc["version"];
  Serial.println(a);

  strPtr=doc["location"];
  strcpy(actionJson->location,strPtr);
  Serial.println(strPtr);

  strPtr=doc["name"];
  strcpy(actionJson->name,strPtr);
  Serial.println(strPtr);
  
  strPtr=doc["state"];
  strcpy(actionJson->state,strPtr);
  Serial.println(strPtr);

  //
  //strcpy(actionJson->,doc["location"]);
  //strcpy(actionJson->name,    doc[""]);
  //strcpy(actionJson->state,   doc[""]);
  return 0;
}

int setupDeviceJson(char* jasonStr,EspLightPoint *mLightPoint){
     int i=0;
     char ptr[64]="";
     StaticJsonDocument<1024> doc;
     DeserializationError error = deserializeJson(doc,jasonStr);
     if (error) {
        logInfo(LOG_TAG,F("deserializeJson() failed: "));
        logInfo(LOG_TAG,error.c_str());
        return -1;
     }
     logInfo(LOG_TAG,"Test");
     logInfo(LOG_TAG,(mLightPoint->getDeviceType()).c_str());
     logInfo(LOG_TAG,(mLightPoint->getDeviceID()).c_str());
     strcpy(ptr, (mLightPoint->getDeviceType()).c_str());
     doc["thingName"]= ptr;
     strcpy(ptr, (mLightPoint->getDeviceID()).c_str());
     doc["deviceID"]= ptr;
     int index = doc["attributes"]["numConnections"];
     logInfo(LOG_TAG,"Setup Jason= ");
     logInfo(LOG_TAG,index);
     for(i=0; i<index; i++){
        doc["attributes"]["connections"][i]["requestedState"] = 
              ( (mLightPoint->getGPIOStatus(i)) == 1)? "on" : "off" ;
        doc["attributes"]["connections"][i]["currentState"] = 
             (  (mLightPoint->getGPIOStatus(i)) == 1)? "on" : "off" ;
     }
     serializeJson(doc,gDeviceJsonArray,1024); 
     mLightPoint->jsonLength = measureJson(doc);
     printJson(mLightPoint);
}
char* getDeviceJsonString(){
  return gDeviceJsonArray;
}
void  printJson(EspLightPoint *mLightPoint){
  int i=0,lineCharCount=0;
  logInfo(LOG_TAG,"Json length=");
  if(mLightPoint)
    logInfo(LOG_TAG,mLightPoint->jsonLength);
  /*for(i=0 ; i< mLightPoint->jsonLength ; i++){
     if (lineCharCount++ > SERIAL_LOG_CHARCOUNT_IN_LINE) {
      Serial.println();
      lineCharCount = 0;
    }
    Serial.print(gDeviceJsonArray[i]);
  }*/
  Serial.print(gDeviceJsonArray);
  Serial.println();
}
  
 void  printJson1(){
  Serial.print(gDeviceJsonArray);
  Serial.println();
}
