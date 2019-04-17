/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <gpio.h>
#include "EspOledDisplay.h"

#if 1
EspDisplay::EspDisplay(int gpio):display(OLED_RESET){
    display.begin(SSD1306_SWITCHCAPVCC, 0x3C); //initialize with the I2C addr 0x3D (for the 128x64)
    display.setRotation(1);//1->portrait  0->landscape 
    display.display();
    delay(500);
    xCoor=5;
    yCoor=10;
    //Clear the buffer
    display.clearDisplay();
    // draw a single pixel
    display.drawPixel(xCoor, yCoor, WHITE);
    // Show the display buffer on the hardware.
    // NOTE: You _must_ call display after making any drawing commands
    // to make them visible on the display hardware!
    display.display();
    delay(2000);
    display.clearDisplay();
}
#endif
