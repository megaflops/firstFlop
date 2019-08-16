/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <gpio.h>
#include "EspOledDisplay.h"
#include "EspLightPoint.h"
#include "Config.h"
#include "esplog.h"
#include "espJason.h"

#define LOG_TAG  "espLP"

EspLightPoint::EspLightPoint(String deviceType,String deviceId,String brokerAddress,int Gpio) {
    logErr(LOG_TAG,"EspLightPoint constructer");
    mqttClient.setClient(espWifiClient);
    mqttClient.setCallback([this] (char* topic, byte* payload, unsigned int length) { this->messageCallback(topic, payload, length); });
    mqttClientId = deviceId;
    deviceID = deviceId;
    type = deviceType;
    state = STATE_INIT;
    tickOccured = false;
    registrationSubsDone = false;
    broker = brokerAddress;
    ledGPIO = Gpio;
    onBoardGPIO = LED_ONMODULE;
    reconnectCount =0;
    jsonLength=0;
    mOnBoardLED[0] = new EspLight(LED_ONBOARD);
    mOnBoardLED[1] = new EspLight(LED_ONMODULE);
    mOnBoardLED[2] = new EspLight(D5); //GPIO14
    mOnBoardLED[3] = new EspLight(D6); //GPIO12
    mBoard.loadConfigFromFlash();
    //setupDisplay();
}

bool EspLightPoint:: setupDisplay(){
   mDispPtr = new EspDisplay(10);
   mDispPtr->setTextSize(1);
   mDispPtr->setCursor(mDispPtr->xCoor,mDispPtr->yCoor);
   mDispPtr->setTestColor(0);
   mDispPtr->displayString("INIT::OFF");
   mDispPtr->draw();
   mDispPtr->clearDisplay();
}
bool EspLightPoint::setGatewayServer(String hostname, int port) {
    this->hostname = hostname;
    this->port = port;
    mqttClient.setServer(this->hostname.c_str(),this->port);
}

bool EspLightPoint::connectToGateway() {
    if (!mqttClient.connected()) {
        mqttClient.connect(getDeviceID().c_str());
    }
}
bool EspLightPoint::isConnected() {
     if (!mqttClient.connected()) {
        return false;
    }
    return true;
}

bool EspLightPoint::prepareCommands(){
     logInfo(LOG_TAG," preparing cmds");
     String tDeviceType = getDeviceType();
     String tDeviceID = getDeviceID();
     registerTopic =            "/" + tDeviceType + "/"  +"cmd" +"/" +"register";
     publishStatus =            "/" + tDeviceType + "/"  +"data" +"/" +"status";
     deRegisterTopic =          "/" + tDeviceType + "/"  +"cmd" +"/" +"deRegister";
     //Subscription
     subsRegistrationAccepted = "/" + tDeviceType +"/"   +"cmd" +"/" + "registeraccepted"+ "/" +tDeviceID;
     subsAction =               "/" + tDeviceType +"/"   +"cmd" +"/" + "action"+ "/" +tDeviceID;
     subsStatus =               "/" + tDeviceType +"/"   +"cmd" +"/" + "status"+ "/" +tDeviceID;
     subsReset =                "/+/cmd/reset/+";
     logInfo(LOG_TAG,registerTopic.c_str());
}

bool EspLightPoint::doSubcription() {
    logInfo(LOG_TAG," Subscribed to :");
    logInfo(LOG_TAG,subsAction);
    logInfo(LOG_TAG,subsStatus);
    logInfo(LOG_TAG,subsReset);
    mqttClient.subscribe(subsAction.c_str());
    mqttClient.subscribe(subsStatus.c_str());
    mqttClient.subscribe(subsReset.c_str());
    mqttClient.subscribe(subsRegistrationAccepted.c_str());
    registrationSubsDone = true;
}

bool EspLightPoint::sendStatus() {
    if (isRegistered()) {
       logInfo(LOG_TAG,"Sending status");
       logInfo(LOG_TAG,publishStatus.c_str());
        mqttClient.publish(publishStatus.c_str(),getDeviceJsonString());
    }
    else{
        logInfo(LOG_TAG,"Sending Status EspLightPoint not registerd");
    }
}
bool EspLightPoint::sendRegistrationReq() {
    if (isRegistered()) {
        logInfo(LOG_TAG,"EspLightPoint already registerd");
        return true;
    }
    logInfo(LOG_TAG,"EspLightPoint not registerd");
    mqttClient.publish(registerTopic.c_str(),getDeviceJsonString());
    //mqttClient.publish(registerTopic.c_str(),"rakesh");
    logInfo(LOG_TAG,"Device registration req sent...");
    logInfo(LOG_TAG,"Topic   : ");
    logInfo(LOG_TAG,registerTopic.c_str());
    logInfo(LOG_TAG,"payload : ");
    if(registrationSubsDone == false){
        logInfo(LOG_TAG,"Subscribe to : ");
        logInfo(LOG_TAG,subsRegistrationAccepted.c_str());
        mqttClient.subscribe(subsStatus.c_str());
        mqttClient.subscribe(subsReset.c_str());
        mqttClient.subscribe(subsRegistrationAccepted.c_str());
        registrationSubsDone = true;
    }
}
bool EspLightPoint::isRegistered() {
     bool result = false;
    if(state == STATE_REGISTER)
        result = true;
    return result;
}
void EspLightPoint::reconnect() {
     // Loop until we're reconnected
    logInfo(LOG_TAG,"reconnect required ... ");
    while (!mqttClient.connected()) {
        logInfo(LOG_TAG,"Attempting MQTT connection...");
        // Attempt to connect
        if (mqttClient.connect(getDeviceID().c_str())) {
            Serial.println("connected");
            doSubcription();
            reconnectCount =0;
            break;
        } else {
            logInfo(LOG_TAG,"failed, rc=");
            logInfo(LOG_TAG,mqttClient.state());
            Serial.println(" try again in 5 seconds");
            // Wait 5 seconds before retrying
            reconnectCount++;
            if(reconnectCount > 3){
               delay(3*1000*60); //wait for 3 minutes
            }
            else{
               delay(2000);
           }
       }
    }
}

bool EspLightPoint::setupCallback() {
}
void EspLightPoint::messageCallback(String topic, byte* message, unsigned int length) {
    logInfo(LOG_TAG,"Message arrived on topic: ");
    logInfo(LOG_TAG,topic);
    logInfo(LOG_TAG,". Message: ");
    String messageTemp;
    for (int i = 0; i < length; i++) {
         messageTemp += (char)message[i];
    }
    logInfo(LOG_TAG,messageTemp.c_str());
    switch(state){
      case STATE_RESET:
            logInfo(LOG_TAG,"State RESET");
            break;
      case STATE_INIT:
              if(strstr(topic.c_str(),"registeraccepted")) {
                logInfo(LOG_TAG,"Registration accepted in init... ");
                logInfo(LOG_TAG,messageTemp);
                sessionID=messageTemp;
                doSubcription();
                state = STATE_REGISTER;
                sendStatus();
                }
           else if(strstr(topic.c_str(),"reset")) {
              logInfo(LOG_TAG,"Received RESET in init");
              sendRegistrationReq();
              //cancel all subsscription
              state = STATE_INIT; 
               }
          else
              logInfo(LOG_TAG,"No valid cmd in Init");
             break;

      case STATE_REGISTER:
          if(topic == registerTopic) {
            logInfo(LOG_TAG,"Received Register response in register");
          }
          else if(strstr(topic.c_str(),"registeraccepted")) {
            logInfo(LOG_TAG,"Received Register accepted in register");
          }
          else if(strstr(topic.c_str(),"action")) {
             logInfo(LOG_TAG,"Received action in register");
             //do something
             static ActionJson  action;
             int result;
             int index=0;
             result = parseJsonForAction(messageTemp.c_str(), &action,1024);
             //strcpy(action.name,"light2");
             //strcpy(action.location,"room1");
             //strcpy(action.state,"on");
            if(result == 0){
                if(updateDeviceJason(&action,&index)){
                     logErr(LOG_TAG,"Error in updating device Json from action json");
                }
                else{
                     logErr(LOG_TAG,"SUCCESS updating device Json from action json");
                     logErr(LOG_TAG,index); 
                     if(strcmp(action.state,"on") == 0){
                            mOnBoardLED[index]->turnOn();
                            mOnBoardLED[index+2]->turnOn();
                            logInfo(LOG_TAG,"Turning LED ON");
                    }
                    else if( strcmp(action.state,"off")== 0){
                        mOnBoardLED[index]->turnOff();
                        mOnBoardLED[index+2]->turnOff();
                        logInfo(LOG_TAG,"Turning LED OFF");
                    }
                    else{
                        logErr(LOG_TAG,"wrong action");
                    }
                    sendStatus();
                }    
            }
            else{
                logErr(LOG_TAG,"Error in parseJsonForAction");
            }
             /*
              //gpioStatus = mLightPoint->getGPIOStatus(mLightPoint->getGPIOnum());
             if(messageTemp == "1"){
              mOnBoardLED->turnOn();
              mDispPtr->setCursor(mDispPtr->xCoor,mDispPtr->yCoor);
              mDispPtr->displayString(" ON ");
              mDispPtr->draw();
              mDispPtr->clearDisplay();
            }
             else{
              mOnBoardLED->turnOff();
              mDispPtr->setCursor(mDispPtr->xCoor,mDispPtr->yCoor);
              mDispPtr->displayString(" OFF ");
              mDispPtr->draw();
              mDispPtr->clearDisplay();
            }*/
          }
          else if(strstr(topic.c_str(),"status")) {
             logInfo(LOG_TAG,"Received Status in register");
             sendStatus();
             //do something
          }
          else if(strstr(topic.c_str(),"reset")) {
            logInfo(LOG_TAG,"Received Reset in register");
            //cancel all subsscription
             state = STATE_INIT;
             sendRegistrationReq();
            //do something
          }
          else{
              logInfo(LOG_TAG,"No valid cmd in register");
          }
          break;
          default:
             logInfo(LOG_TAG,"State : default");
    }
 }

void EspLightPoint::setLpPowerState(String msg) {
    if(msg == "on"){
        logInfo(LOG_TAG," Turning Lightpoint On");
    }
    else if(msg == "off"){
        logInfo(LOG_TAG," Turning Lightpoint Off");
    }
}

void EspLightPoint::setLpLumnious(String msg) {
    logInfo(LOG_TAG,"Changing brightness to ");
    logInfo(LOG_TAG,msg);
}

bool EspLightPoint::start(void) {
    if(!mqttClient.loop()) {
        return false;
    }
    return true;
}

bool EspLightPoint::factoryReset(String msg) {
    if(msg == "yes"){
        logInfo(LOG_TAG," Do factory reset");
        mBoard.factoryReset(true);
    }
}
