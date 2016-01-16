var database = require("../javascripts/database.js");
	
function saveContactInfo(name, email, phoneNumber, message, next) {
	   database.query("SET CHARACTER SET utf8"); // supporting chinese characters
       database.query("SET NAMES utf8");
       database.query( "INSERT INTO  contact ( name, phone, email, message)" +
		"VALUES ('" + name + "', '" + phoneNumber + "' , '" + email + "' ,  '" + message + "')", function(err) {
			if (!err) {
				next(null);
			} else {
				next(err);
				console.log("Error while performing Query. \n" + err);
			}
		});
}

module.exports.saveContactInfo = saveContactInfo;
