var socketIOClient = require("socket.io-client");
exports.client = newSocketIOClient;

exports.createNewClient = function (userID, receiver) {
	this.userID = userID;
	var socket = new socketIOClient.connect('localhost/privateChat', {
		"port": 4443,
		"force new connection": true
	});
	socket.on('connect', function () {
		console.log(util.format("tester %s connected", userID));
		socket.emit(privateInfoUpdateEvent, {
			"userID": userID,
			"receiverID": receiver
		});
	});
	return socket;
};