var express = require('express');
var router = express.Router();
//var jquery = require("jquery");
var auth = require('../javascripts/Oauth.js')
var dialog = require("dialog");

var userAccount = require("../javascripts/userAccount.js");
var contact = require("../javascripts/contactInfo.js");             //js that handles the contact info posted on our website

router.get('/', function(req, res) {
    res.redirect('index');
});

router.get('/index', function(req, res) {
    console.log(req.cookies);
    res.render('index', {title: "Home"});
});

router.route("/login")
	.get(auth.validate, function(req, res) {
		if(req.validation == true) {
			res.redirect("/profile");
		} else {
			res.render('login', {title: 'Login', message: ""});
		}
	})
	.post(function(req, res) {
		var userName = req.body.username;
		var password = req.body.password;

		auth.authenticate(userName, password, function(err, token) {
			if(!err) {
				res.cookie("OPCWeb_token", {
					"token": token,
					"status": 202
				});
				res.redirect("/profile");
			} else {
				res.render('login', {title: 'Login', message: err});
			}
		});
	});

router.route("/register")
	.get(auth.validate, function(req, res) {
		if(req.validation == true) {
			res.redirect("/profile");
		} else {
			res.render('register', {title: 'Register', message: ""});
		}
	})
	.post(function(req, res) {
		if(req.validation == true) {
			res.redirect("/profile");
		} else {
			var userName = req.body.username;
			var password = req.body.password;
			var confirmPassword = req.body.confirmPassword;

			userAccount.register(userName, password, confirmPassword, function(err) {
				if(!err) {
					console.log("Registration Success.");
					dialog.info("太棒了！您已经有一个账号了，现在请登录。", "注册成功！", function(err) {
						if(!err) {
							res.redirect("/login");
						}
					});
				} else {
					console.log("Registration Failure.");				
					res.render("/register?error=" + err);
				}
			});
		}
	});

router.get('/logout', function(req, res) {
	//req.session.user = null;
	//req.session.error = null;
	res.cookie("OPCWeb_token", null);
    res.redirect('/');
});

router.get('/home', auth.validate, function(req, res) {
    res.render('home', { "title": 'Home', "user": req.cookies.OPCWeb_session.userName});
});

router.get("/about", function(req, res) {
    console.log(req.cookies);
	res.render("about", {title: "About"})
});

router.route("/contact")
    .get(function(req, res) {
        console.log(req.cookies);
    	res.render("contact", {title: "Contact"})
    })
    .post(function(req,res) {
    	var contactName = req.body.contactName;
    	var contactEmail = req.body.contactEmail;
    	var contactPhone = req.body.contactPhone;
    	var contactMessage = req.body.contactMessage;
        contact.saveContactInfo(contactName, contactEmail, contactPhone, contactMessage, function(err) {
        	if(!err) {
        		console.log("contact message has successfully stored!" );
        		res.redirect("/contact");
        	} else {
        		console.log("contact message saved Failure");			
				res.redirect("/contact?error=" + err);
        	}
        });
    }); 

module.exports = router;