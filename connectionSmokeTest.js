var clientCreator = require("./clientCreator.js");
var util = require('util');

//Private Chat Events
var privateSendMessageEvent		= "sendMessEv";
var privateReceiveMessageEvent	= "recMessEv";
var privateInfoUpdateEvent		= "infoUpEv";

var TEST_NUM = 10000;
var TEST_SEG = 1000;

var endSig = false;
var i = 0;
var log = "";
var timer = [];
var startTime = [];
var endTime = [];

var loop = function () {
	if (endSig) {
		console.log(log);
		console.log("total time = %ds %dns", endTime[0], endTime[1]);
		return;
	}
	var start = i*TEST_SEG + 1;
	var end = (i+1)*TEST_SEG;
	if (end >= TEST_NUM) {
		end = TEST_NUM;
		endSig = true;
	}

	var counter = 0;
	var failed = 0;
	timer.push(process.hrtime());
	if (i == 0) startTime = timer[0]; //Store total start time
	for (var j = start; j <= end; j++) {
		clientCreator.createNewClient(util.format("%s", j), "2", function (err, succeed) {
			if (err) failed++;
			counter++;
			var total = end - start + 1;
			if (counter == total) {
				timer[i] = process.hrtime(timer[i]);
				if (endSig) endTime = process.hrtime(startTime);
				log += "loop " + i + ": total: " + total + " err: " + failed + " total time: " + timer[i][0] + "s and " + timer[i][1] + "ns\n";
				i++;
				next();
			}
		});
	}

};

var next = function () {
	console.log("next loop!");
	loop();
};

loop();
