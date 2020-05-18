var express = require('express');
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Anupam's Blog" });
});



// GitHub

router.get("/auth/github", passport.authenticate("github"))

router.get(
  "/auth/github/callback", 
  passport.authenticate("github",{failureRedirect: "/users"}),
  (req, res)=>{
    console.log(req.user, "git user details");
    
    res.redirect("/articles");
  }
);

// Google 


router.get('/auth/google',
  passport.authenticate("google", { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate("google", { failureRedirect: '/users' }),
  function(req, res) {
    console.log(req.user, "google user details");
    // Successful authentication, redirect home.
    res.redirect('/articles');
  }
);

module.exports = router;
