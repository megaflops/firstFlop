
var cloudBrokerIp="mqtt://192.168.0.103/1883"
//var cloudBrokerIp = "mqtt://iot.eclipse.org";
exports.cloudBrokerIp = cloudBrokerIp
var myId="CL2C"
var HwId="F2AFDCL"
var myType="GWC"
exports.myId=myId
exports.HwId=HwId
exports.myType=myType
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
var gwIdIndex=1
var gwTypeIndex=3
var gwSubIdIndex=2
exports.commandIndex=commandIndex
exports.gwIdIndex=gwIdIndex
exports.gwTypeIndex=gwTypeIndex
exports.gwSubIdIndex=gwSubIdIndex
//Subsscription
var action ="/" +HwId +"/" +myId + "/" +myType + "/" +"ACTION_FROM_MF_CLOUD"
var status= "/" +HwId +"/" +myId + "/" +myType + "/" +"STATUS_FROM_MF_CLOUD"
exports.action=action
exports.status=status
//Subscribe
var register="/+/+/+/REGISTER_TO_MF_CLOUD"
exports.register=register
//from device
var gwRegistrationAcceptedSubs="ACCEPTED_FROM_MF_CLOUD"
var gwStatusSubs="STATUS_TO_MF_CLOUD"
var gwActionPub="ACTION_FROM_MF_CLOUD"
exports.gwActionPub=gwActionPub
exports.gwRegistrationAcceptedSubs=gwRegistrationAcceptedSubs
exports.gwStatusSubs=gwStatusSubs

