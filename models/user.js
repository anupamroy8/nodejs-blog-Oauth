var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt")


var userSchema = new Schema({
    email: {
        type:String,
        lowercase:true,
        trim:true,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    github: {
        name: String,
        avatar_url: String,
        login: String,
    },
    google: {
        name: String,
        picture: String,
    },
    providers: {
        type: [String]
    }
}, {timestamps:true});

userSchema.pre("save", function(next) {
    if(this.password &&  this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
})

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model("User", userSchema);

module.exports = User;