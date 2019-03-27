//var localBrokerIp="mqtt://192.168.0.103/1883";
var localBrokerIp="mqtt://iot.eclipse.org";
exports.localBrokerIp = localBrokerIp
deviceNameType="switch"
exports.deviceNameType=deviceNameType
deviceID="DEVICE1FF1";
exports.deviceID=deviceID;
var keepAlive=40
exports.keepAlive=keepAlive
var qos=1
exports.qos=qos
var retain=false
exports.retain=retain
//States
var stateInit=0
exports.stateInit=stateInit
var stateConnected=1;
exports.stateConnected=stateConnected

//Subscription
var statusSubs="/"+deviceNameType+"/cmd/status/"+deviceID;
exports.statusSubs=statusSubs;
var actionSubs="/"+deviceNameType+"/cmd/action/"+deviceID;
exports.actionSubs=actionSubs;
var registerAcceptedSubs="/"+deviceNameType+"/cmd/registeraccepted/"+deviceID;
exports.registerAcceptedSubs=registerAcceptedSubs;
var resetSubs="/+/cmd/reset/+";
exports.resetSubs=resetSubs;

//Publlish
var registerPublilsh="/"+deviceNameType+"/cmd/register";
exports.registerPublilsh=registerPublilsh;
var deRegisterPublilsh="/"+deviceNameType+"/cmd/deregister";
exports.deRegisterPublilsh=deRegisterPublilsh;
var statusPublilsh="/"+deviceNameType+"/data/status";
exports.statusPublilsh=statusPublilsh;

//Message index
var commandIndex=3
var deviceIdIndex=4
var deviceTypeIndex=1
var commandTypeIndex=2
exports.commandIndex=commandIndex
exports.deviceIdIndex=deviceIdIndex
exports.deviceTypeIndex=deviceTypeIndex
exports.commandTypeIndex=commandTypeIndex