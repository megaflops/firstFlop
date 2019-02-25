//Include File System Headers
#include <FS.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Ticker.h>
#include <Arduino.h>
#include "EspSpiffs.h"
#include "Esp8266Boardconfig.h"
#include "EspLightPoint.h"
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
  mLightPoint->prepareCommands(mLightPoint->getMqttClientId());
  mLightPoint->sendRegistrationReq(mLightPoint->getMqttClientId());
  mLightPoint->doSubcription();
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
EspLightPoint *gLightPoint[5];
int gDeviceCount=0;

void setup() {
  Serial.begin(115200);
  // spiffs setup
  if (!mSpiffs.init()) {
    Serial.println("failed to setup file system");
  }
  mSpiffs.dumpStorageStats();
  setupBoard();
  Serial.println("Board setup done...");
  String devId = String(mBoardconfig.getDeviceId());
  //Set up as many as possible board, and increment device count;
  gLightPoint[0] = new EspLightPoint("LP",devId,"ND",String("192.168.0.103"),LED_ONBOARD);
  //gLightPoint[0] = new EspLightPoint("LP",devId,"lp1",String("iot.eclipse.org"),LED_ONBOARD);
  setupLightPoint(gLightPoint[0]);
  Serial.println("setupLightPoint setup done...");
  setupTimer(gLightPoint[0],10000);
  Serial.println("setupLightPoint timer done...");
  gDeviceCount++;
  // 2nd Instance
  //Set up as many as possible board, and increment device count;
  /*
  gLightPoint[1] = new EspLightPoint("LP",devId,"lp2",String("iot.eclipse.org"),2);
  setupLightPoint(gLightPoint[1]);
  Serial.println("setupLightPoint setup done...");
  setupTimer(gLightPoint[1],12000);
  Serial.println("setupLightPoint timer done...");
  gDeviceCount++;
  */
  //Set up end
}
EspLightPoint * mLightPoint = NULL;
// Board loop function
void loop() {
    int i=0;
    char *sentStaus;
    int gpioStatus=0;
    for(i=0 ; i<gDeviceCount; i++){
        mLightPoint = gLightPoint[i];
        if(mLightPoint == NULL){
          Serial.println("mLightPoint is NULL for device number");
          break;
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
         mLightPoint->sendRegistrationReq(mLightPoint->getMqttClientId());
      }
      if(mLightPoint->state == STATE_REGISTER){
        if(mLightPoint->statusRequest == 0){
          Serial.println("Waiting to status request");
        }
      }
   }
   if(mLightPoint->state == STATE_REGISTER){
      if(mLightPoint->statusRequest == 1){
           Serial.print("Sending status from loop for::");
           Serial.println(i);
           gpioStatus = mLightPoint->getGPIOStatus(mLightPoint->getGPIOnum());
           if(gpioStatus == 1){
            Serial.println("Led in ON");
            sentStaus = "1";
           }
           else{
            Serial.println("Led in OFF");
            sentStaus = "0";
           }
           mLightPoint->sendStatus(String(sentStaus));
           mLightPoint->statusRequest =0;
        }
     }/*f(mLightPoint->state == STATE_REGISTER)*/
 }
 delay(50);
}
