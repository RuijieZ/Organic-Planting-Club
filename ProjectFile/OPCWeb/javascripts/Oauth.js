var database = require("../javascripts/database.js");
var userAccount = require("../javascripts/userAccount.js");

var privateKey = "hardcoded_key_for_now";
var jwt = require("jwt-simple");
var util = require("util");
//var SHA256 = require("crypto-js/sha256");
//var compare = require("deep-equal");
var jwt = require("jwt-simple");

function validate(req, res, next) {
	if(!req.cookies.OPCWeb_token) {
		req.validation = false;
		next();
		return;
	}
	
    try {	
        //console.log(req.cookies.OPCWeb_token);

        var session = jwt.decode(req.cookies.OPCWeb_token.token, privateKey);
        //console.log("====" + util.inspect(req.cookies.OPCWeb_token));

        //console.log("session = " + util.inspect(session));
        //console.log(session.access_token);

		// TODO: Extra token field checking
		
        console.log(req.cookies);
		req.validation = true;
		next();
    } catch (err) {
        console.log(err);
		req.validation = false;
        next(err);
    }
	return;
}

function authenticate(userName, password, next) {
    userAccount.signIn(userName, password, function(err, userName) {
        if(!err) {
            console.log("Authorization Success.");
			var payload = {
				"userName": userName,
				"expiry": new Date()
			};
			var token = jwt.encode(payload, privateKey);
			next(null, token, userName);
        } else {
            console.log("Authorization Failure.");
            next(err, null, null);
        }
    });
}

module.exports.validate = validate;
module.exports.authenticate = authenticate;