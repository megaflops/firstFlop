#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <gpio.h>
#include "EspOledDisplay.h"
#include "EspLightPoint.h"
#include "Config.h"


EspLightPoint::EspLightPoint(String deviceType,String gID, String deviceId,String brokerAddress,int Gpio) {
    Serial.println("EspLightPoint constructer");
    mqttClient.setClient(espWifiClient);
    mqttClient.setCallback([this] (char* topic, byte* payload, unsigned int length) { this->messageCallback(topic, payload, length); });
    mqttClientId = deviceId;
    gId = gID;
    type = deviceType;
    state = STATE_INIT;
    tickOccured = false;
    registrationSubsDone = false;
    broker = brokerAddress;
    ledGPIO = Gpio;
    reconnectCount =0;
    statusRequest=0;
    mOnBoardLED = new EspLight(ledGPIO);
    mBoard.loadConfigFromFlash();
    setupDisplay();
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
        mqttClient.connect(gId.c_str());
    }
}
bool EspLightPoint::isConnected() {
     if (!mqttClient.connected()) {
        return false;
    }
    return true;
}

bool EspLightPoint::prepareCommands(String myId){
     Serial.println(" preparing cmds");
     registerTopic =            "/" + gId + "/" + mqttClientId +"/"  + type + "/" +TOPIC_REGISTER_TOPIC;
     //subsRegistrationAccepted = "/" + gId + "/" + "+/"  + type + "/" +TPOIC_REGISTER_ACCEPTED;
     subsRegistrationAccepted = TPOIC_REGISTER_ACCEPTED;
     subsAction =               "/" + gId + "/" + mqttClientId +"/"  + type + "/" +TOPIC_SUBSCRIPTION;
     subsStatus =               "/" + gId + "/" + mqttClientId +"/"  + type + "/" +TOPIC_STATUS_FROM_GW;
     //subsReset =              "/" + gId + "/" + mqttClientId +"/"  + type + "/" +TOPIC_RESET;
     subsReset =                TOPIC_RESET;
     publishStatus =            "/" + gId + "/" + mqttClientId +"/"  + type + "/" +TOPIC_STATUS;
     Serial.println(registerTopic.c_str());
}

bool EspLightPoint::doSubcription() {
    Serial.println(" Subscribed to :");
    Serial.println(subsAction);
    Serial.println(subsStatus);
    Serial.println(subsReset);
    mqttClient.subscribe(subsAction.c_str());
    mqttClient.subscribe(subsStatus.c_str());
    mqttClient.subscribe(subsReset.c_str());
    mqttClient.subscribe(subsRegistrationAccepted.c_str());
    //mqttClient.subscribe("/LP/lp1/GW_RESET");
}

bool EspLightPoint::sendStatus(String devStatus) {
    //char payload[BUF_SIZE] = {0};
    //String topicRegRes(TOPIC_REG_RES);
    //topicRegRes += mqttClientId;
    if (isRegistered()) {
        Serial.println("EspLightPoint already registerd");
        mqttClient.publish(publishStatus.c_str(),devStatus.c_str());
    }
    else{
        Serial.println("Sending Status EspLightPoint not registerd");
    }
}
bool EspLightPoint::sendRegistrationReq(String devID) {
    //char payload[BUF_SIZE] = {0};
    //String topicRegRes(TOPIC_REG_RES);
    //topicRegRes += mqttClientId;
    if (isRegistered()) {
        Serial.println("EspLightPoint already registerd");
        return true;
    }
    Serial.println("EspLightPoint not registerd");
    if(devID == String("lp1"))
      mqttClient.publish(registerTopic.c_str(),REGISTER_MSG);
    else
      mqttClient.publish(registerTopic.c_str(),REGISTER_MSG);
    Serial.println("Device registration req sent...");
    Serial.print("Topic   : ");
    Serial.println(registerTopic);
    Serial.print("payload : ");
    Serial.println(REGISTER_MSG);
    if(registrationSubsDone == false){
        Serial.print("Subscribe to : ");
        Serial.println(subsRegistrationAccepted.c_str());
        mqttClient.subscribe(subsRegistrationAccepted.c_str());
        mqttClient.subscribe(subsReset.c_str());
        registrationSubsDone = true;
    }
}

bool EspLightPoint::isRegistered() {
    //bool result = mBoard.getStatus() & 0x02;
    bool result = false;
    if(state == STATE_REGISTER)
        result = true;
    return result;
}

void EspLightPoint::reconnect() {
     // Loop until we're reconnected
    Serial.print("reconnect required ... ");
    while (!mqttClient.connected()) {
        Serial.print("Attempting MQTT connection...");
        // Attempt to connect
        if (mqttClient.connect(gId.c_str())) {
            Serial.println("connected");
            doSubcription();
            reconnectCount =0;
            break;
        } else {
            Serial.print("failed, rc=");
            Serial.print(mqttClient.state());
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
    Serial.print("Message arrived on topic: ");
    Serial.print(topic);
    Serial.print(". Message: ");
    String messageTemp;

    for (int i = 0; i < length; i++) {
        Serial.print((char)message[i]);
        messageTemp += (char)message[i];
    }
    Serial.println();

    switch(state){
      case STATE_RESET:
            Serial.println("State us RESET");
            break;
      case STATE_INIT:
              if(strstr(topic.c_str(),"ACCEPTED_TO_MF_GATEW")) {
            //if (topic == subsRegistrationAccepted){
                Serial.println("Registration accepted in init... ");
                Serial.println(messageTemp);
                  mqttClientId=messageTemp;
                //mqttClientId = messageTemp;
                doSubcription();
                state = STATE_REGISTER;
                //mBoard.loadConfigToFlash();
                }
           //else if(topic == subsReset){
           else if(strstr(topic.c_str(),"GW_RESET_TO_MF_GATEW")) {
              Serial.println("Received RESET in init");
              //cancel all subsscription
              state = STATE_INIT; 
               }
          else
              Serial.println("No valid cmd in Init");
             break;

       case STATE_REGISTER:
          if(topic == registerTopic) {
            Serial.println("Received Register response in register");
          }
          else if(strstr(topic.c_str(),"ACCEPTED_TO_MF_GATEW")) {
          //else if(topic == subsRegistrationAccepted){
             Serial.println("Received Register accepted in register");
          }
          else if(topic == subsAction){
             Serial.println("Received action in register");
             //do something
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
            }
          }
          else if(topic == subsStatus){
             Serial.println("Received Status in register");
             statusRequest=1;
             //do something
          }
          else if(strstr(topic.c_str(),"GW_RESET_TO_MF_GATEW")) {
          //else if(topic == subsReset){
             Serial.println("Received Reset in register");
             //cancel all subsscription
             state = STATE_INIT; 
             //do something
          }
          else{
              Serial.println("No valid cmd in register");
          }
          break;
          default:
             Serial.println("State : default");
    }
 }

void EspLightPoint::setLpPowerState(String msg) {
    if(msg == "on"){
        Serial.print(" Turning Lightpoint On");
    }
    else if(msg == "off"){
        Serial.print(" Turning Lightpoint Off");
    }
}

void EspLightPoint::setLpLumnious(String msg) {
    Serial.print("Changing brightness to ");
    Serial.println(msg);
}

bool EspLightPoint::start(void) {
    if(!mqttClient.loop()) {
        return false;
    }
    return true;
}

bool EspLightPoint::factoryReset(String msg) {
    if(msg == "yes"){
        Serial.print(" Do factory reset");
        mBoard.factoryReset(true);
    }
}
