/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

gatewayNameType="ATGateway"
exports.gatewayNameType=gatewayNameType
var gatewayID="GATEWAY1FF1"
exports.gatewayID=gatewayID

//var localBrokerIp="mqtt://192.168.1.108/1883";
var localBrokerIp="mqtt://3.95.30.109" //"mqtt://iot.eclipse.org"
exports.localBrokerIp = localBrokerIp
var cloudBrokerIp="mqtt://3.95.30.109"
//"mqtt://173.212.209.27/1883"
exports.cloudBrokerIp = cloudBrokerIp
var keepAlive=40
exports.keepAlive=keepAlive
var qos=1
exports.qos=qos
var retain=false
exports.retain=retain
//States
var stateInit=0
exports.stateInit=stateInit
var stateConnected=1
exports.stateConnected=stateConnected
var stateRegistered=2
exports.stateRegistered=stateRegistered

var publishOptions={
	retain:false,qos:1
}
var publishOptionsR={
	retain:true,qos:1
}