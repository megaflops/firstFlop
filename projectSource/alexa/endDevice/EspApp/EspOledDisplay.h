#ifndef HEADER_ESPDISPLAY
#define HEADER_ESPDISPLAY
#define OLED_RESET LED_BUILTIN //4
#define NUMFLAKES 10
#define XPOS 0
#define YPOS 1
#define DELTAY 2


#define LOGO16_GLCD_HEIGHT 16 
#define LOGO16_GLCD_WIDTH  16 
#if (SSD1306_LCDHEIGHT != 64)
#error("Height incorrect, please fix Adafruit_SSD1306.h!");
#endif
static const int timerIntervalMs = 1000;
static const int threshold = 5;  // tweak me
static const int gpio = 14;

#define MAX_DURATION_TIMEOUT    60
#define LED_ONMODULE    2
#define LED_ONBOARD     16
//Adafruit_SSD1306 display(OLED_RESET);

class EspDisplay {
  private:
     Adafruit_SSD1306 display;

  public:
    int xCoor;
    int yCoor;
    EspDisplay(int gpioPin);
    void clearDisplay() { display.clearDisplay();}
    void start() {display.begin(SSD1306_SWITCHCAPVCC, 0x3C);}
    void setTextSize(int size) {display.setTextSize(2);}
    void setTestColor(int color) {display.setTextColor(WHITE);}
    void drawPixel(int x,int y,int color){display.drawPixel(x, y, color);}
    void setCursor(int x, int y){ display.setCursor(x,y);}
    void draw() { display.display();}
    void displayString(char *p) {display.println(p);}
};
/*
EspOledDisplay::EspOledDisplay(int gpio){
    display(OLED_RESET);
    display.begin(SSD1306_SWITCHCAPVCC, 0x3C); //initialize with the I2C addr 0x3D (for the 128x64)
    display.display();
    delay(2000);
    //Clear the buffer.
    display.clearDisplay();
    // draw a single pixel
    display.drawPixel(10, 10, WHITE);
    // Show the display buffer on the hardware.
    // NOTE: You _must_ call display after making any drawing commands
    // to make them visible on the display hardware!
    display.display();
    delay(2000);
    display.clearDisplay();
}*/
#endif
