var localBrokerIp="mqtt://192.168.0.103/1883";
//var localBrokerIp="mqtt://iot.eclipse.org";
exports.localBrokerIp = localBrokerIp
var hwId="F2AFD"
var myId="GW2"
exports.myId=myId
exports.hwId=hwId
var keepAlive=40
exports.keepAlive=keepAlive
var qos=1
exports.qos=qos
var retain=false
exports.retain=retain
//States
var STATE_INIT=0
exports.STATE_INIT=STATE_INIT
//Message index
var commandIndex=4
var deviceIdIndex=1
var deviceSubIdIndex=2
var deviceTypeIndex=3
exports.commandIndex=commandIndex
exports.deviceIdIndex=deviceIdIndex
exports.deviceTypeIndex=deviceTypeIndex
exports.deviceSubIdIndex=deviceSubIdIndex
//Subsscription
var register="/+/+/+/REGISTER_TO_MF_GATEW"
exports.register=register

var deRegister="/+/+/+/DEREGISTER_TO_MF_GATEW"
//var status="/+/+/+/STATUS_TO_MF_GATEW"
exports.deRegister=deRegister
//exports.status=status
//Publish
var reset= "/" +hwId +"/" +myId +"/" +"ND" +"/" +"GW_RESET_TO_MF_GATEW"
exports.reset=reset
//to device dynamic msgs 
var deviceRegistrationAcceptedSubs="ACCEPTED_TO_MF_GATEW"
var deviceStatusSubs="STATUS_TO_MF_GATEW"
var statusPublish="STATUS_FROM_MF_GATEW"
var devicePublishMessageAction="ACTION_TO_MF_GATEW"
exports.deviceRegistrationAcceptedSubs=deviceRegistrationAcceptedSubs
exports.deviceStatusSubs=deviceStatusSubs
exports.devicePublishMessageAction=devicePublishMessageAction
