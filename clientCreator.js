var util = require("util");
var socketIOClient = require("socket.io-client");

//Private Chat Events
var privateSendMessageEvent		= "sendMessEv";
var privateReceiveMessageEvent	= "recMessEv";
var privateInfoUpdateEvent		= "infoUpEv";

exports.createNewClient = function (userID, receiver, callback) {
	this.userID = userID;
	var socket = new socketIOClient.connect('localhost/privateChat', {
		"port": 4443,
		"force new connection": true
	});
	socket.on('connect', function () {
		console.log(util.format("tester %s connected", userID));
		// callback(null, true);
		socket.emit(privateInfoUpdateEvent, {
			"userID": userID,
			"receiverID": receiver
		}, function (ack) {
			if (ack == 33) {
				callback(null, true);
			} else {
				callback(new Error("set user failed"), false);
			}
		});
	});
	return socket;
};