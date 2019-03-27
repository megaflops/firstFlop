#include <Arduino.h>
#include "EspLight.h"

EspLight::EspLight(int gpioPin) {
    this->gpioPin = gpioPin;
    pinMode(this->gpioPin, OUTPUT);
    digitalWrite(this->gpioPin,HIGH);
}
void EspLight::turnOn() {
    digitalWrite(this->gpioPin,LOW);
}

int EspLight::getStatus() {
    int status=0;
    status = digitalRead(this->gpioPin);
    if(status == LOW)
      return 1;
   else
      return 0;
}
void EspLight::blink(int delayMs) {
    turnOff();
    delay(delayMs);
    turnOn();
    delay(delayMs);
}

void EspLight::turnOff() {
    digitalWrite(this->gpioPin,HIGH);
}


void EspLight::wifiConnecting() {
    blink(100);
}

void EspLight::smartConfigConnecting() {
    blink(50);
    blink(50);
}


void EspLight::mqttConnecting() {
    blink(50);
}

// void EspLight::errorInternetDown() {

// }
