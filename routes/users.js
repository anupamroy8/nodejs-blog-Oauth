var express = require('express');
var router = express.Router();
var User = require("../models/user");

// User List
router.get('/', function(req, res, next) {
    res.render("login");
});

router.post('/', function(req, res, next) {
    let { email, password} = req.body;

    if(!email || !password){
        return res.redirect("/");
    }

    User.findOne({ email }, (err, user)=> {
        if(err) return next(err);
        if(!user) {
            console.log("Wrong user");
            return res.redirect("/users");
        }
        else if(!user.verifyPassword(password)) {
            console.log("Wrong Password");
            return res.redirect("/users");
        }

        req.session.userId = user.id;
        console.log("logged in")
        res.redirect("/articles")
    })
});

// User registration
router.get('/register', function(req, res, next) {
    res.render("register");
});

router.post('/register', function(req, res, next) {
    User.create(req.body, (err, user)=>{
        if(err) return next(err);
        // console.log(user);
        res.redirect("/users");
    })
})

// User Logout

router.get("/logout", function(req, res, next) {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect("/");
})

  module.exports = router;