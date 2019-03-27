
#define ERROR_LOG 1
#define INFO_LOG 2
#define WARNING_LOG 3
//extern int gLogFlag =3;

#define log(logLevel,tag,string) \
        if(logLevel <= 3) { \
            Serial.print(tag); \
            Serial.print(":"); \
            Serial.println(string) ;\
            }

#define logErr(tag,string) \
        log(ERROR_LOG,tag,string)

#define logInfo(tag,string) \
        log(INFO_LOG,tag,string)

#define logWarn(tag,string) \
        log(WARNING_LOG,tag,string)        
