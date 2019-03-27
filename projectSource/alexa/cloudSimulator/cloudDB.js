function gatewayDBClass(config){
    this.gatewayID=config.gatewayID;
    this.gatewayNameType=config.gatewayNameType; 
    this.gatewayDeviceListJson = JSON.stringify(config);
}
module.exports=gatewayDBClass;