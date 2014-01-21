var helper = require("./helper.js");
var util = require("util");
var fs = require('fs');

var sql = "";
for (var i = 1001; i <= 10000; i++) {
	var password = helper.encryptPassword("12345", 20);
	sql += util.format("INSERT INTO `securityInfo` (`id`, `registerEmail`, `salt`, `password`) VALUES ('%s', 'test%s@test.com', '%s', '%s');\n",
		i, i, password.salt, password.password);
}
fs.appendFile("securityInfo.sql", sql, function (err) {
	if (err) console.log(err);
});
