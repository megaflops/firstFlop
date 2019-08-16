/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
function gatewayDBClass(config){
    this.gatewayID=config.gatewayID;
    this.gatewayNameType=config.gatewayNameType; 
    this.gatewayDeviceListJson = JSON.stringify(config);
    this.pending = 0;
}
module.exports=gatewayDBClass;