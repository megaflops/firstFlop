/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
dm=require("../deviceClient/deviceManager");
cm=require("../cloudClient/cloudManager");
//cl=require("../../cloudSimulator/cloud")

cm.cloudManagerInit();
dm.deviceManagerInit();
//cl.cloudInit();
