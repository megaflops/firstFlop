typedef struct ActionJson{
   int  version;
   char location[64];
   char name[64];
   char state[64];
   int  cmdId;
}ActionJson;

extern char gDeviceJson[];
extern char gDeviceJsonArray[];
int updateDeviceJason(ActionJson*actionJson , int *);
int parseJsonForAction(const char* jasonStr, ActionJson *actionJson,int length);
int setupDeviceJson(char* jasonStr,EspLightPoint *mLightPoint);
void printJson(EspLightPoint *mLightPoint);
char* getDeviceJsonString();
