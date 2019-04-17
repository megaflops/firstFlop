/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
#include <Arduino.h>
#include "Utils.h"
#include "Config.h"

String Utils::genDeviceId(){
  String chipid = String(ESP.getChipId(),HEX);
  String flashId = String(ESP.getFlashChipId(),HEX);
  String deviceId = String("ESP" + chipid + flashId);
  deviceId.toUpperCase();
  Serial.print("Device id generated : ");
  Serial.println(deviceId);
  return deviceId;
}
