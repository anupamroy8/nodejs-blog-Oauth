var User = require("../models/user")

exports.checkUserLogged = (req, res, next)=>{
    if(req.session.userId) {
        next();
    } else {
        res.redirect("/users")
    }
};

exports.UserInfo = (req, res, next)=>{
    if(req.session.userId) {
        User.findById(req.session.userId, "name email",function(err, user) {
            if(err) return next(err);
            req.UserInfo = user;
            res.locals.user = user;
            console.log(req.UserInfo);
            next()
        })
    } else {
        req.UserInfo = null;
        res.locals.user = null;
        next();
    }
};
