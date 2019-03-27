#ifndef HEADER_ESPLIGHTPOINT
#define HEADER_ESPLIGHTPOINT

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <gpio.h>
#include "Esp8266Boardconfig.h"
#include "EspLight.h"
#include "EspOledDisplay.h"

#define SIZE_256       256

#define TOPIC_REGISTER_TOPIC        "REGISTER_TO_MF_GATEW"
#define TPOIC_REGISTER_ACCEPTED     "/+/+/+/ACCEPTED_TO_MF_GATEW"
#define TOPIC_SUBSCRIPTION          "ACTION_TO_MF_GATEW"
#define TOPIC_STATUS                "STATUS_TO_MF_GATEW"
#define TOPIC_RESET                 "/+/+/+/GW_RESET_TO_MF_GATEW"
#define TOPIC_STATUS_FROM_GW        "STATUS_FROM_MF_GATEW"
enum{
    STATE_INIT,
    STATE_REGISTER,
    STATE_RESET
};

#define REGISTER_MSG "/esp/lp1/LP"
#define REGISTER_MSG1 "{\"type\": \"LP\",\"mapping\":{\"id\":\"lp2\",\"des\":\"t1\",\"link\":\"1\", \"state\":\"0\"}}"
/*
#define REGISTER_TOPIC "REGISTER_TO_MF_GATEW"
#define REGISTER_ACCEPTED "ACCEPTED_TO_MF_GATEW"
#define SUBSCRIPTION "ACTION_TO_MF_GATEW"
#define RESET "GW_RESET_TO_MF_GATEW"
#define STATUS "STATUS_TO_MF_GATEW"
*/
class EspLightPoint {
    private:
        WiFiClient espWifiClient;
        PubSubClient mqttClient;
        Esp8266Boardconfig mBoard;
        String hostname;
        String mqttClientId;
        int port;
        String type;
        String deviceID;
        bool tickOccured;
        bool registrationSubsDone;
        /* Subscrittion & Registration*/
        String registerTopic;
        String subsRegistrationAccepted;
        String subsAction;
        String subsStatus;
        String subsReset;
        String publishStatus;
        String deRegisterTopic;
        /****/
        void setLpPowerState(String msg);
        void setLpLumnious(String msg);
        bool factoryReset(String msg);
        EspLight *mOnBoardLED[2];
        int ledGPIO;
        int onBoardGPIO;
        EspDisplay *mDispPtr;
    public:
        os_timer_t timer;
        String  broker;
        int state;
        int reconnectCount;
        String sessionID;
        int jsonLength;
        EspLightPoint(String deviceType,String deviceId,String brokerAddress,int);
        void messageCallback(String topic, byte* message, unsigned int length);
        bool setGatewayServer(String host, int port);
        bool setupCallback(void);
        bool connectToGateway(void);
        bool isConnected(void);
        bool sendRegistrationReq();
        bool sendStatus();
        bool isRegistered(void);
        bool doSubcription(void);
        bool start(void);
        void reconnect(void);
        void sendLumniousStatus(void);
        bool prepareCommands();
        String getMqttClientId() { return mqttClientId;}
        void setTickOccured(bool flag) { tickOccured=flag;}
        bool getTickOccured() {return tickOccured;}
        int  getGPIOStatus(int index) { return mOnBoardLED[index]->getStatus();}
        int  getGPIOnum(int index) {if (index == 0) return ledGPIO; else return onBoardGPIO;}
        bool setupDisplay();
        String getDeviceID(){ return deviceID;}
        String getDeviceType() {return type;}
};

#endif
