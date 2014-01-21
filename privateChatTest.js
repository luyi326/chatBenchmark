var clientCreator = require("./clientCreator.js");
var util = require('util');

//Private Chat Events
var privateSendMessageEvent		= "sendMessEv";
var privateReceiveMessageEvent	= "recMessEv";
var privateInfoUpdateEvent		= "infoUpEv";

var TEST_NUM = 500;
var TEST_SEG = 100;

// STAGE I
console.log("STAGE I kick start");
var endSig = false;
var i = 0;
var log = "";
var socketList = [];
var messageCount = 0;

(function () {
		var loop = function () {
		if (endSig) {
			console.log(log);
			console.log("exiting STAGE I");
			stage2();
			return;
		}
		var start = i*TEST_SEG + 1; //starting point for current seg
		var end = (i+1)*TEST_SEG; //end point for current seg
		if (end >= TEST_NUM) {
			end = TEST_NUM;
			endSig = true;
		}

		var counter = 0;
		var failed = 0;
		for (var j = start; j <= end; j++) {
			(function () {
				var receiver = j;
				var myI = j;
				// generate a receiver in range and regenerate if sender receiverred
				while (receiver == j) receiver = Math.ceil(Math.random()*TEST_NUM);

				var newSoc = clientCreator.createNewClient(util.format("%s", myI), String(receiver), function (err, succeed) {
					// console.log("gened user " + myI);
					newSoc.receiver = receiver;
					receiver = null;
					if (!err) {
						newSoc.on(privateReceiveMessageEvent, function (data) {
							if(!data || data.length == 0) return;
							messageCount++;
							console.log(myI + " received message , total receive til now: " + messageCount);
						});
					}
					// console.log("pushing");
					socketList.push(newSoc);

					if (err) failed++;
					counter++;
					var total = end - start + 1;
					if (counter == total) {
						log += "loop " + i + ": total: " + total + " err: " + failed + "\n";
						i++;
						next();
					}
				});
			}) ();
		}

	};

	var next = function () {
		console.log("next loop!");
		loop();
	};

	loop();

})();

// STAGE II
var stage2 = function () {
	console.log("ENTER STAGE II");
	// console.log("total sockets in list: " + socketList.length);
	for (var index in socketList) {
		(function () {
			var myIndex = index;
			var myID = parseInt(myIndex) + 1;
			socketList[myIndex].emit(privateSendMessageEvent, {
				"content": "tester" + myID + " to tester" + (socketList[myIndex].receiver + " 1"),
				"sender" : myIndex+1,
				"to": socketList[myIndex].receiver
			}, function (ack) {
				console.log(myID + " received ack: " + ack);
			});
			socketList[myIndex].emit(privateSendMessageEvent, {
				"content": "tester" + myID + " to tester" + (socketList[myIndex].receiver + " 2"),
				"sender" : myIndex+1,
				"to": socketList[myIndex].receiver
			}, function (ack) {
				console.log(myID + " received ack: " + ack);
			});
			socketList[myIndex].emit(privateSendMessageEvent, {
				"content": "tester" + myID + " to tester" + (socketList[myIndex].receiver + " 3"),
				"sender" : myIndex+1,
				"to": socketList[myIndex].receiver
			}, function (ack) {
				console.log(myID + " received ack: " + ack);
			});
		})();
	}
};
