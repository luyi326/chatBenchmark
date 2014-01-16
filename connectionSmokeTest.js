var clientCreator = require("./clientCreator.js");
var util = require('util');

//Private Chat Events
var privateSendMessageEvent		= "sendMessEv";
var privateReceiveMessageEvent	= "recMessEv";
var privateInfoUpdateEvent		= "infoUpEv";

for (var i = 1; i <= 1000; i++) {
	clientCreator.createNewClient(util.format("%s", i), "2");
}