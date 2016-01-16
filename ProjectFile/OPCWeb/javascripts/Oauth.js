var database = require("../javascripts/database.js");

var privateKey = "hardcoded_key_for_now";
var jwt = require("jwt-simple");
var util = require("util");
//var SHA256 = require("crypto-js/sha256");
//var compare = require("deep-equal");

function validate(req, res, next) {
    try {
        //console.log(req.cookies.OPCWeb_token);
        var session = jwt.decode(req.cookies.OPCWeb_token, privateKey);
        //console.log("====" + util.inspect(req.cookies.OPCWeb_token));

        //console.log("session = " + util.inspect(session));
        //console.log(session.access_token);

        res.cookie("OPCWeb_session", {
            "userName": session.userName,
            "status": 202
        });
        console.log(req.cookies);
    } catch (err) {
        console.log(err);
        res.cookie("OPCWeb_session", {
            "userName": null,
            "status": 401
        });
    }
    next();
}

function authenticate(req, res, next) {
    userAccount.signIn(userName, password, function(err, token) {
        if(!err) {
            console.log("Authorization Success. ");
            res.cookie("OPCWeb_token", token);
            res.redirect("/profile");
        } else {
            console.log("Authorization Failure.");
            res.redirect("/login");
        }
    });
}

module.exports.validate = validate;
module.exports.authenticate = authenticate;