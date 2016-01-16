var express = require('express');
var router = express.Router();
var auth = require('../javascripts/Oauth.js')

var userAccount = require("../javascripts/userAccount.js");

router.get('/profile', auth.validate, function(req, res) {
    console.log("==============printed from profile====================");
    console.log(req.cookies);

    res.render("profile", {title: "Profile"});
});

router.route("/resetPassword")
    .get(function(req, res) {
        if(!req.session.user) {
            req.session.error = "请先登录。";
            res.redirect("/login");
        } else {
            console.log("reached pre");
            res.render("resetPassword", {"title": "Reset Password", "message": ""});
            console.log("reached pre-a");
        }
    })
    .post(function(req, res) {
        var password = req.body.password;
        var newPassword = req.body.newPassword;
        var confirmNewPassword = req.body.confirmNewPassword;

        if(newPassword != confirmNewPassword) {
            res.render("resetPassword", {
                "title": "Reset Password",
                "message": "两次输入密码不符，请重新输入"
            });
        } else {
            userAccount.resetPassword(password, newPassword, function(err) {
                if(err) {
                    res.render("resetPassword", {
                        "title": "Reset Password",
                        "message": "发生错误。\n错误信息：" + err + "\n请重试或联系管理员。"
                    });
                } else {
                    req.session.user = null;
                    req.session.error = "密码修改成功，现在请重新登录。";
                    res.redirect("/login");
                }
            });
        }
    });

module.exports = router;
