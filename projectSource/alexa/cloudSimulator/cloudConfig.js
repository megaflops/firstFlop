var cloudBrokerIp="mqtt://test.mosquitto.org"
exports.cloudBrokerIp = cloudBrokerIp
var cloudID="CLOUD1FF1"
exports.cloudID=cloudID
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
var stateRegistered=2;
exports.stateRegistered=stateRegistered
//Subscription
var registerSubscription="/+/cmdcld/register";
exports.registerSubscription=registerSubscription;
var deregisterSubscription="/+/cmdcld/de-register";
exports.deregisterSubscription=deregisterSubscription;
var statusSubscription="/+/datacld/status";
exports.statusSubscription=statusSubscription;
//Publish
var statusPublish="/cmdcld/status/";
exports.statusPublish=statusPublish;
var actionPublish="/cmdcld/action/";
exports.actionPublish=actionPublish;

var resetPublish="/xx/cmdcld/reset/yy";
exports.resetPublish=resetPublish;

var registeracceptedPublish="/cmdcld/registeraccepted/";
exports.registeracceptedPublish=registeracceptedPublish;



//Message index
var commandIndex=3
var commandTypeIndex=2
var deviceTypeIndex=1
exports.commandIndex=commandIndex
exports.commandTypeIndex=commandTypeIndex
exports.deviceTypeIndex=deviceTypeIndex
