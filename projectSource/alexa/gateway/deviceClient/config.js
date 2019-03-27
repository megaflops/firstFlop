//Subscription
var registerSubscription="/+/cmd/register";
exports.registerSubscription=registerSubscription;
var deregisterSubscription="/+/cmd/de-register";
exports.deregisterSubscription=deregisterSubscription;
var statusSubscription="/+/data/status";
exports.statusSubscription=statusSubscription;
//Publish
var statusPublish="/cmd/status/";
exports.statusPublish=statusPublish;
var actionPublish="/cmd/action/";
exports.actionPublish=actionPublish;

var resetPublish="/xx/cmd/reset/yy";
exports.resetPublish=resetPublish;

var registeracceptedPublish="/cmd/registeraccepted/";
exports.registeracceptedPublish=registeracceptedPublish;



//Message index
var commandIndex=3
var commandTypeIndex=2
var deviceTypeIndex=1
exports.commandIndex=commandIndex
exports.commandTypeIndex=commandTypeIndex
exports.deviceTypeIndex=deviceTypeIndex
