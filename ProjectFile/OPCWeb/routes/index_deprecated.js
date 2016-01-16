var express = require('express');
var router = express.Router();
var jwt = require("jwt-simple");

var userAccount = require("../javascripts/userAccount.js");
var contact = require("../javascripts/contactInfo.js");             //js that handles the contact info posted on our website

var key = "121312312412";

router.get('/', function(req, res) {
    res.redirect('index');
});

router.get('/index', function(req, res) {
    res.render('index', {title: "Home"});
});

router.route('/login')
    .get(function(req, res) {
		if(req.session.user) {
			res.redirect("/home");
		} else {
			if(!req.session.error) {
				res.render('login', {title: 'Login', message: ""});
			} else {
				res.render('login', {title: 'Login', message: req.session.error});
			}
		}
    })
    .post(function(req, res) {
		var uname = req.body.username;
		var upass = req.body.password;
		
		userAccount.signIn(uname, upass, req.session, function(err) {
			if(!err) {
				console.log("Authorization Success. ");
				req.session.user = uname;
				req.session.error = null;
				res.redirect("/home");
			} else {
				console.log("Authorization Failure.");
				req.session.error = "用户名或密码错误，请重新输入。";
				res.redirect("/login");
				console.log(err);
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
	req.session.user = null;
	req.session.error = null;
    res.redirect('/');
});

router.get('/home', function(req, res) {
    if(!req.session.user) {
		req.session.error = "请先登录。";
		res.redirect("/login");
	} else {
		res.render('home', { "title": 'Home', user: req.session.user});
	}
});

router.get("/about", function(req, res) {
	res.render("about", {title: "About"})
});

router.route("/contact")
    .get(function(req, res) {
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