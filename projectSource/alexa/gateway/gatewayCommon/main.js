/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
var local=1;
 dm=require("../deviceClient/deviceManager");
cm=require("../cloudClient/cloudManager");
if(local == 1){
    cl=require("../../cloudSimulator/cloud")
    al = require("../../cloudSimulator/alexaInterface");
}
cm.cloudManagerInit();
dm.deviceManagerInit();
if(local == 1){
    cl.cloudInit();
    al.alexaInterfaceInit(0);
}
