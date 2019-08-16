
var fs=require('fs');
var log=require('./trace');
cl = require("./cloud");
al = require("./alexaInterface");

LOG_TAG_CLOUD_MAIN = "cloudMain";

cl.cloudInit();
log.Info(LOG_TAG_CLOUD_MAIN,"Init cloud done");
al.alexaInterfaceInit(0);
