var express = require('express');
var router = express.Router();
//var jquery = require("jquery");
var auth = require('../javascripts/Oauth.js')

var userAccount = require("../javascripts/userAccount_exp.js");
var contact = require("../javascripts/contactInfo.js");             //js that handles the contact info posted on our website

router.get('/', function(req, res) {
    res.redirect('index');
});

router.get('/index', function(req, res) {
    console.log(req.cookies);
    res.render('index', {title: "Home"});
});

router.route('/login')
    .get(auth.validate, function(req, res) {
        console.log(req.cookies.OPCWeb_session);
        if(req.cookies.OPCWeb_session.status == 202) {
            res.redirect("/profile");
        } else {
            res.render('login', {title: 'Login', message: ''});
        }
    })
    .post(function(req, res) {
		var userName = req.body.username;
		var password = req.body.password;

		userAccount.signIn(userName, password, function(err, token, session) {
			if(!err) {
				console.log("Authorization Success. ");
                res.cookie("OPCWeb_token", token);
                res.cookie("OPCWeb_session", session);
				res.redirect("/profile");
			} else {
				console.log("Authorization Failure.");
				res.redirect("/login");
			}
		});
    });

router.route('/register')
    .get(function(req, res) {
        console.log("called");
		if(req.session.user) {
			res.redirect("/home");
		} else {
			var errMessage = req.query.error;
			var showMessage = "";
			if(!errMessage) {
				console.log("errMessage is empty");
			} else {
				if(errMessage == 001) {
					showMessage = "用户名需要6到10位数字或字母，请重新输入。"
				} else if(errMessage == 010) {
					showMessage = "密码需要至少6位数字或者字母， 请重新输入。"
				} else if(errMessage == 011) {
					showMessage = "两次输入密码不一致，请重新输入。"
				} else {
					res.redirect("/register");
				}
			
				console.log(showMessage);
			}
			res.render('register', {title: 'Register', message: showMessage});
		}
    })
    .post(function(req, res) {
        var userName = req.body.username;
        var password = req.body.password;
		var confirmPassword = req.body.confirmPassword;

        userAccount.register(userName, password, confirmPassword, function(err) {
			if(!err) {
				console.log("Registration Success.");
				req.session.error = "太棒了！您已经有一个账号了，现在请登录。";
				res.redirect("/login");
			} else {
				console.log("Registration Failure.");				
				res.redirect("/register?error=" + err);
			}
		});
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