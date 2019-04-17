//Include File System Headers
/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

#include <FS.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Ticker.h>
#include <Arduino.h>
#include "EspSpiffs.h"
#include "Esp8266Boardconfig.h"
#include "EspLightPoint.h"
#include "espJason.h"
#include "Config.h"
#include "Utils.h"

EspSpiffs mSpiffs;
Esp8266Boardconfig mBoardconfig;

Utils mUtils;

//setup light point device
void setupLightPoint(EspLightPoint *mLightPoint) {
  String mqttHost ;
  //= String(MQTT_BROKER_HOST);
  mqttHost=mLightPoint->broker;
  int mqttPort = MQTT_BROKER_PORT;
  mLightPoint->setGatewayServer(mqttHost,mqttPort);
  mLightPoint->connectToGateway();

  //while(mLightPoint->isConnected() != true ) {
  //  delay(500);
  //}
  mLightPoint->prepareCommands();
  mLightPoint->doSubcription();
  mLightPoint->sendRegistrationReq();
  mLightPoint->start();
  Serial.println("setupLightPoint.......ok");
}

// ESP board setup
void setupBoard() {
  int timeout = 0;
  #ifndef USE_FIX_SSID
  mBoardconfig.doWifiSetup();
  #else
  mBoardconfig.wifiConnect(FIX_SSID, FIX_PASSWORD);
  #endif
  Serial.println("wifi_setup.......ok");
  while (!mBoardconfig.isInternetServiceAvailable()) {
    if ( timeout++ >= INTERNET_CONN_TIMEOUT ) {
      ESP.reset();
      delay(5000);
    }
    delay(1000);
    Serial.println("Internet connection check required...");
  }
}

void timerCallback(void *pArg) {
      ((EspLightPoint*)pArg)->setTickOccured(true);;
} // End of timerCallback

void setupTimer(EspLightPoint *mLightPoint, int timerInMs)
{
   os_timer_setfn(&mLightPoint->timer,timerCallback, (void*)mLightPoint);
   os_timer_arm(&mLightPoint->timer,timerInMs,true);
}

/*
typedef struct{
  int timerCount;
  EspLightPoint *espLP;
  void *(timerCallBacl)(void *pArg);
}devObject;
devObject gObj[5];
*/
EspLightPoint *gLightPoint;

void setup() {
  Serial.begin(115200);
  // spiffs setup
  if (!mSpiffs.init()) {
    Serial.println("failed to setup file system");
  }
  mSpiffs.dumpStorageStats();
  setupBoard();
  Serial.println("Board setup done...");
  String devId = "DEVICE1FF1" + String(mBoardconfig.getDeviceId());
  //Set up as many as possible board, and increment device count;
  gLightPoint = new EspLightPoint("Switch",devId,String("3.91.218.134"),LED_ONBOARD);
  //iot.eclipse.org"
  setupDeviceJson(gDeviceJson,gLightPoint);
  setupLightPoint(gLightPoint);
  Serial.println("setupLightPoint setup done...");
  //setupTimer(gLightPoint,10000);
  Serial.println("setupLightPoint timer done...");
  //Set up end
}
EspLightPoint * mLightPoint = NULL;
// Board loop function
void loop() {
    int i=0;
    char *sentStaus;
    int gpioStatus=0;
    mLightPoint = gLightPoint;
    if(mLightPoint == NULL){
      Serial.println("mLightPoint is NULL for device number");
    }
    if (!mLightPoint->isConnected()) {
      mLightPoint->reconnect();
    }
  
    if(!mLightPoint->start()) {
     mLightPoint->reconnect();
    }
    if( mLightPoint->getTickOccured()== true){
      Serial.print("Tick occured for::");
      Serial.println(i);
      mLightPoint->setTickOccured(false);
      if(mLightPoint->state == STATE_INIT){
         Serial.print("Sending registration from loop for::");
         Serial.println(i);
         mLightPoint->sendRegistrationReq();
      }
      if(mLightPoint->state == STATE_REGISTER){
      }
   }
   if(mLightPoint->state == STATE_REGISTER){
    
     }/*f(mLightPoint->state == STATE_REGISTER)*/
  delay(50);
}
