var database = require("../javascripts/database.js");
var crypto = require("crypto");
var jwt = require("jwt-simple");
var key = "121312312412";
	
function signIn(userName, password, session, next) {
	if(!checkUserName(userName)) {
		console.log("Invalid Username: " + userName);
		next(001);
	} else if(!checkPassword(password)) {
		console.log("Invalid Password: " + password);
		next(010);
	} else {
		database.query("SELECT password FROM test WHERE username=?", [userName], function (err, rows) {
			if (!err) {
				if (rows.length <= 0) {
					next(401);
				} else {
					var shasum = crypto.createHash("sha1");
					shasum.update(password);

					if (rows[0].password == shasum.digest("hex")) {
						delete shasum;

                        database.query("update test set session = ? WHERE username=?", [jwt.encode(session, key), userName], function (err, rows) {
                            if (!err) {
                                next(null);
                            } else {
                                next(401);
                            }
                        });
					} else {
						delete shasum;
						next(401);
					}
				}
			} else {
				console.log("Error while performing Query. \n" + err);
				next(err);
			}
		});
	}
}

function register(userName, password, confirmPassword, next) {
	if(!checkUserName(userName)) {
		console.log("Invalid Username: " + userName);
		next(001);
	} else if(!checkPassword(password)) {
		console.log("Invalid Password: " + password);
		next(010);
	} else if(confirmPassword != password) {
		console.log("Unmatched paaswords");
		next(011);
	} else {
		database.query("INSERT INTO test (username, password)" +
				"VALUES (?, SHA1(?))", [userName, password], function(err) {
				if (!err) {
					next(null);
				} else {
					next(err);
					console.log("Error while performing Query. \n" + err);
				}
			});
	}
}

function checkUserName(userName) {
	//TODO: more strict userName pre-check procedure
	if(!userName.match(/(\w)+/)) {
		return false;
	} else if(userName.length < 6 || userName.length > 10000){
		return false;
	} else {
		return true;
	}
}

function checkPassword(password) {
	//TODO: more strict password pre-check procedure
	if(password.length < 6){
		return false;
	} else {
		return true;
	}
}

function getProfile(userName, next) {
	database.query("SELECT * FROM test where username=?", [userName], function(err, rows) {
		if(!userName || rows.length <= 0) {
			next(401, null);
		} else {
			var info = rows[0];
			var profile = {
				userName: userName,
				scores: 0,
				currentTask: "",
				doneTask: ""
			};
			next(null, profile);
		}
	});
}

function resetPassword(userName, password, newPassword, next) {
	if(!checkPassword(password)) {
		next("旧密码输入有误，请重试。");
	} else if(!checkPassword(newPassword)) {
		next("新密码输入有误，请重试。");
	}

	database.query("SELECT password FROM test WHERE username=?", [userName], function(err, rows) {
		if(!userName || rows.length <= 0) {
			next("查无此用户。");
		} else {
			var record = rows[0].password;
			var _shasum_old = crypto.createHash("sha1");
			var _shasum_new = crypto.createHash("sha1");

			_shasum_old.update(password);
			_shasum_new.update(newPassword);

			var tmp = _shasum_old.digest("hex");
			console.log(password);
			console.log(tmp);
			console.log(record);

			if(record != tmp) {
				next("旧密码输入有误。");
			} else if(record == _shasum_new.digest("hex")) {
				next("新旧密码不能相同。");
			} else {
				database.query("UPDATE test SET password=SHA1(?) WHERE username='" + userName + "'", [newPassword], function (err) {
					if (err) {
						next("发生未知错误。\n" + err)
					} else {
						next(null);
					}
				});
			}
		}
	});
}

module.exports.signIn = signIn;
module.exports.register = register;
module.exports.getProfile = getProfile;
module.exports.resetPassword = resetPassword;