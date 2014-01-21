var validator = require("email-validator");
var uuid = require('node-uuid');
var crypto = require('crypto');

exports.rand_string = function(length) {
	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var size  = chars.length;
	var str = "";
	for (var i = 0; i < length; i++) {
		str = str + chars[Math.floor((Math.random() * (size - 1)))];
	}
	return str;
};

exports.encryptPassword = function(password, length) {
	var salt = "";
	if (password.length < length) {
		salt = exports.rand_string(length - password.length);
	}
	var encryptedPassword = crypto.createHash("sha256").update(salt + password, "ascii").digest("hex");
	return {
		"salt": salt,
		"password": encryptedPassword
	};
};

exports.checkPassword = function(salt, input, password) {
	var passwordIn = crypto.createHash("sha256").update(salt + input, "ascii").digest("hex");
	return (passwordIn == password);
};

exports.getStringFromFile = function(fileName, shouldKeepFile) {
//Deprecated
};

exports.writeStringToFile = function(str, prepend) {
//Deprecated
};

exports.makeThumbnailFromBase64EncodedString = function(str, newPath) {
//Deprecated
};

exports.validEmail = function(email) {
	return validator.validate(email);
};

exports.uuidV4 = function() {
	return uuid.v4();
};

