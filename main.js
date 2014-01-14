var socketIOClient = require("socket.io-client");
var util = require('util');

//Private Chat Events
var privateSendMessageEvent		= "sendMessEv";
var privateReceiveMessageEvent	= "recMessEv";
var privateInfoUpdateEvent		= "infoUpEv";

var createNewClient = function (userID) {
	var socket = new socketIOClient.connect('localhost/privateChat', {
		"port": 4443,
		"force new connection": true
	});

	socket.on('connect', function () {
		console.log(util.format("tester %s connected", userID));
		socket.emit(privateInfoUpdateEvent, {
			"userID": userID,
			"receiverID": "2"
		});
	});

	socket.on('message', function (message) {
		console.log("Benchmarker received message: " + message);
	});
};

for (var i = 1; i <= 100; i++) {
	createNewClient(util.format("%s", i));
}