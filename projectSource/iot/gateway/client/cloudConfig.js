
var cloudBrokerIp="mqtt:///192.168.0.103/1883"
//var cloudBrokerIp = "mqtt://iot.eclipse.org";
//var cloudBrokerIp="mqtt:///172.16.4.173/1883"
exports.cloudBrokerIp = cloudBrokerIp
var myId="GW2C"
var HwId="F2AFD"
var myType="GW"
exports.myId=myId
exports.HwId=HwId
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
var deviceTypeIndex=3
var deviceSubIdIndex=2
exports.commandIndex=commandIndex
exports.deviceIdIndex=deviceIdIndex
exports.deviceTypeIndex=deviceTypeIndex
exports.deviceSubIdIndex=deviceSubIdIndex
//Subscription
var action ="/" +HwId +"/" +myId + "/" +myType +"/" +"ACTION_FROM_MF_CLOUD"
var status= "STATUS_FROM_MF_CLOUD"
var registrationAcceptedSubs= "/" +HwId +"/" +myId + "/" +myType +"/" +"ACCEPTED_FROM_MF_CLOUD"
exports.action=action
exports.status=status
//Publish
var register= "/" +HwId +"/" +myId + "/" +myType +"/" + "REGISTER_TO_MF_CLOUD"
var reset    ="/" +HwId +"/" +myId + "/" +myType +"/" + "GW_RESET_TO_MF_CLOUD"
exports.reset=reset
exports.register=register
//from device
var statusPublish="/" +HwId +"/" +myId + "/" +myType +"/" +"STATUS_TO_MF_CLOUD"
exports.statusPublish=statusPublish
exports.registrationAcceptedSubs=registrationAcceptedSubs

