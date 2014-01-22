var clientCreator = require("./clientCreator.js");
var util = require('util');

//Private Chat Events
var privateSendMessageEvent		= "sendMessEv";
var privateReceiveMessageEvent	= "recMessEv";
var privateInfoUpdateEvent		= "infoUpEv";

var TEST_NUM = 10000;
var TEST_SEG = 1000;
var WAIT_TIME_LOW_B = 0;
var WAIT_TIME_UP_B = 10;
var CHANCE_SEND_MESSAGE = 0.35;

// STAGE I
console.log("STAGE I kick start");
var endSig = false;
var i = 0;
var log = "";

var socketList = [];
var messageCount = 0;

(function () {
	var timer = [];
	var startTime = [];
	var endTime = [];
	var loop = function () {
		if (endSig) {
			// console.log(log);
			// console.log("Total time: %ds %dns", endTime[0], endTime[1]);
			log += util.format("Total time: %ss\n", endTime[0] + endTime[1]/1000000000);
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
		timer.push(process.hrtime());
		if (i == 0) startTime = timer[0];
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
							if (messageCount == totalMessage) {
								fanale();
							}
						});
					}
					// console.log("pushing");
					socketList.push(newSoc);

					if (err) failed++;
					counter++;
					var total = end - start + 1;
					if (counter == total) {
						timer[i] = process.hrtime(timer[i]);
						if (endSig) endTime = process.hrtime(startTime);
						var timeInSecond = timer[i][0] + timer[i][1]/1000000000;
						log += "loop " + i + ": total: " + total + " err: " + failed + " total time: " + timeInSecond + "s\n";
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

//STAGE II
var shouldSendList = [];
var sendTimeOut = [];
var totalMessage = 0;
var totalDelay = 0;
var stage2 = function() {
	console.log("ENTER STAGE II, generating random events...");
	for (var i = 0; i < TEST_NUM*3; i++) {
		sendTimeOut.push(parseFloat((Math.random()*(WAIT_TIME_UP_B - WAIT_TIME_LOW_B) + WAIT_TIME_LOW_B).toFixed(2))*1000); //times 1000 to convert it to millisecond for the good of setTimeout
	}
	for (var i = 0; i < TEST_NUM; i++) {
		if (Math.random() < CHANCE_SEND_MESSAGE) shouldSendList.push(true);
		else shouldSendList.push(false);
		totalMessage += shouldSendList[i];
		totalDelay += shouldSendList[i] * (sendTimeOut[i*3] + sendTimeOut[i*3+1] + sendTimeOut[i*3+2]);
	}
	totalMessage *= 3;

	console.log("events generated, proceed to STAGE III");
	stage3();
};

// STAGE III
var startTime = [];
var endTime = [];
var biasCorrectionTime = [];
var startedFlag = false;
var stage3 = function () {
	console.log("ENTER STAGE III");
	// console.log("total sockets in list: " + socketList.length);
	for (var index in socketList) {
		(function () {
			var myIndex = index;
			var myID = parseInt(myIndex) + 1;
			if (index == socketList.length - 1) biasCorrectionTime = process.hrtime(startTime);
			if (!shouldSendList[myIndex]) return;
			if (!startedFlag) {
				startedFlag = true;
				startTime = process.hrtime();
			}
			setTimeout(function () {
				socketList[myIndex].emit(privateSendMessageEvent, {
						"content": "tester" + myID + " to tester" + (socketList[myIndex].receiver + " 1"),
						"sender" : myIndex+1,
						"to": socketList[myIndex].receiver
					}, function (ack) {
						console.log(myID + " received ack: " + ack);
				})
			}, sendTimeOut[myIndex*3]);

			setTimeout(function () {
				socketList[myIndex].emit(privateSendMessageEvent, {
						"content": "tester" + myID + " to tester" + (socketList[myIndex].receiver + " 2"),
						"sender" : myIndex+1,
						"to": socketList[myIndex].receiver
					}, function (ack) {
						console.log(myID + " received ack: " + ack);
				})
			}, sendTimeOut[myIndex*3+1]);

			setTimeout(function () {
				socketList[myIndex].emit(privateSendMessageEvent, {
						"content": "tester" + myID + " to tester" + (socketList[myIndex].receiver + " 3"),
						"sender" : myIndex+1,
						"to": socketList[myIndex].receiver
					}, function (ack) {
						console.log(myID + " received ack: " + ack);
				})
			}, sendTimeOut[myIndex*3+2]);
		})();
	}
};

//STAGE IV
// FANALE
var fanale = function () {
	endTime = process.hrtime(startTime);
	console.log("");
	console.log("connection time: ");
	console.log(log);
	console.log("message time: ");
	console.log("Total message is " + totalMessage);
	console.log("Planed delay avg is " + totalDelay/1000/totalMessage + "s");
	console.log("Final delay is %ds", endTime[0] + endTime[1]/1000000000);
	console.log("Delay bias is %ds", biasCorrectionTime[0] + biasCorrectionTime[1]/1000000000);
	var delta = endTime[0] + endTime[1]/1000000000 - totalDelay/1000/totalMessage - (biasCorrectionTime[0] + biasCorrectionTime[1]/1000000000);
	console.log("Delay dalta :" + delta);
	// console.log(sendTimeOut);
	console.log(totalDelay);
	console.log = function (args) {};
};
