var clientCreator = require("./clientCreator.js");

//Private Chat Events
var privateSendMessageEvent		= "sendMessEv";
var privateReceiveMessageEvent	= "recMessEv";
var privateInfoUpdateEvent		= "infoUpEv";

var TEST_NUM = 1000;

var socketList = [];

for (var i = 1; i <= TEST_NUM; i++) {
	(function () {
		var myI = i;
		var receiver = i;
		while (receiver == i) receiver = Math.ceil(Math.random()*TEST_NUM);
		var newSoc = clientCreator.createNewClient(i, receiver, function (err, succeed) {
			newSoc.receiver = receiver;
			receiver = null;
			if (!err) {
				newSoc.on(privateReceiveMessageEvent, function (data) {
					console.log(myI + " received message");
				});
				online();
			}
		});
		socketList.push(newSoc);
	})();
}

var online = function () {
	if (typeof online.counter == "undefined") online.counter = 0;
	online.counter++;
	if (online.counter == TEST_NUM) stage2();
}

// var client1 = clientCreator.createNewClient("1", "2", function (err, succeed) {
// 	if (!err) online();
// });
// var client2 = clientCreator.createNewClient("2", "1", function (err, succeed) {
// 	if (!err) online();
// });
// client1.on(privateReceiveMessageEvent, function (data) {
// 	console.log(data);
// });
// client2.on(privateReceiveMessageEvent, function (data) {
// 	console.log(data);
// });

// //STAGE II
var stage2 = function () {
	for (var index in socketList) {
		(function () {
			var myIndex = index;
			var myID = parseInt(myIndex) + 1;
			socketList[myIndex].emit(privateSendMessageEvent, {
				"content": "tester" + myID + " to tester" + (socketList[myIndex].receiver + " 1"),
				"sender" : myIndex+1,
				"receiver": socketList[myIndex].receiver
			}, function (ack) {
				console.log(myID + " received ack: " + ack);
			});
			socketList[myIndex].emit(privateSendMessageEvent, {
				"content": "tester" + myID + " to tester" + (socketList[myIndex].receiver + " 2"),
				"sender" : myIndex+1,
				"receiver": socketList[myIndex].receiver
			}, function (ack) {
				console.log(myID + " received ack: " + ack);
			});
			socketList[myIndex].emit(privateSendMessageEvent, {
				"content": "tester" + myID + " to tester" + (socketList[myIndex].receiver + " 3"),
				"sender" : myIndex+1,
				"receiver": socketList[myIndex].receiver
			}, function (ack) {
				console.log(myID + " received ack: " + ack);
			});
		})();
	}
};
