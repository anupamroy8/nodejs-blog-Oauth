var passport = require("passport")
var githubStrategy = require("passport-github").Strategy;
var User = require("../models/user");

passport.use(
    new githubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/github/callback"
        },
        (accessToken, refreshToken, profile, done)=>{
            var newUser = {
                email: profile._json.email,
                name:profile._json.name,
                github: {
                    name: profile._json.name,
                    avatar_url: profile._json.avatar_url,
                    login: profile._json.login,
                },
                providers: ["Github"],
            };
            console.log(profile);
            
            User.findOne( {email: profile._json.email}, (err, user) =>{
                if(err) return done(null, false);
                if(!user) {
                    User.create(newUser, (err, user)=>{
                        console.log(user, "new user created");
                        done(null, user)
                    });
                } else if(!user.providers.includes("Github")) {
                    User.findOneAndUpdate({email: profile._json.email}, {
                        $set: {
                            github: {
                                name: profile._json.name,
                                avatar_url: profile._json.avatar_url,
                                login: profile._json.login,
                            },
                        },$push: {providers: ["Github"]}  
                        } ,(err, user)=>{
                            if(err) return done(null, false);
                            console.log(user, "Github user created");
                            done(null, user)
                    })
                } else {
                    console.log(user, "user exists");
                    done(null, user)
                }
            })
        }
    )
)

passport.serializeUser((user, done)=>{
  done(null, user._id)  
})

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user) => {
        if (err) return done(err, false)
        done(null, user);
    })
})


// Google

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
    function(accessToken, refreshToken, profile, done) {
        var newUser = {
            email: profile._json.email,
            name:profile._json.name,
            google: {
                name: profile._json.name,
                picture: profile._json.picture,
            },
            providers: ["Google"],
        };
        User.findOne( {email: profile._json.email}, (err, user) =>{
            if(err) return done(null, false);
            if(!user) {
                User.create(newUser, (err, user)=>{
                    console.log(user, "new user created");
                    done(null, user)
                });
            } else if(!user.providers.includes("Google")) {
                User.findOneAndUpdate({email: profile._json.email},{
                    $set: {
                        google: {
                            name: profile._json.name,
                            picture: profile._json.picture,
                            }
                        },
                    $push: {providers: ["Google"]}
                    
                    } ,(err, user)=>{
                        if(err) return done(null, false);
                        console.log(user, "Google user created");
                        done(null, user)
                })
            } else {
                console.log(user, "user exists");
                done(null, user)
            }
        })
    }
))

passport.serializeUser((user, done)=>{
    done(null, user._id)  
  })

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user) => {
        if (err) return done(err, false)
        done(null, user);
    })
})