/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

gateway=require("../gatewayCommon/common")
//subscription
var statusSubscription="/"+gateway.gatewayNameType+"/cmdcld/status/"+gateway.gatewayID;
exports.statusSubscription=statusSubscription;
var actionSubscription="/"+gateway.gatewayNameType+"/cmdcld/action/"+gateway.gatewayID;
exports.actionSubscription=actionSubscription;
var registerAcceptedSubscription="/"+gateway.gatewayNameType+"/cmdcld/registeraccepted/"+gateway.gatewayID;
exports.registerAcceptedSubscription=registerAcceptedSubscription;
var resetSubscription="/+/cmdcld/reset/+";
exports.resetSubscription=resetSubscription;

//Publish
var registerPublilsh="/"+gateway.gatewayNameType+"/cmdcld/register";
exports.registerPublilsh=registerPublilsh;
var deRegisterPublilsh="/"+gateway.gatewayNameType+"/cmdcld/deregister";
exports.deRegisterPublilsh=deRegisterPublilsh;
var statusPublilsh="/"+gatewayNameType+"/datacld/status";
exports.statusPublilsh=statusPublilsh;

//Message index
var commandIndex=3
var commandTypeIndex=2
var deviceTypeIndex=1
exports.commandIndex=commandIndex
exports.commandTypeIndex=commandTypeIndex
exports.deviceTypeIndex=deviceTypeIndex
