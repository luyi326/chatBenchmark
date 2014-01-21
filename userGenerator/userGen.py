f = open("insertUser.sql", "w")
for x in range(1001, 10001):
	f.write("INSERT INTO `accounts` (`id`,`fid`,`registerEmail`,`username`) VALUES (\'"+str(x)+"\', \'0\', \'test"+str(x)+"@test.com\',\'tester"+str(x)+"\');\n")
	f.write("INSERT INTO `info` (`id`, `name`) VALUES (\'" + str(x) + "\', \'Test" + str(x) + " Testman\');\n")
