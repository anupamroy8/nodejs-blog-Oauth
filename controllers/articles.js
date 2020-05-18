var express = require('express');
var router = express.Router();
var path = require('path');

// Require model
const Article = require("../models/article");
const Comment = require("../models/comment")

// multer
var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../public/images/uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
  }
})
 
var upload = multer({ storage: storage })

// 

exports.listArticle = (req, res, next)=> {
    Article.find({}, (err, article)=> {
        if (err) return next(err);
        // console.log(req.flash("warning"));
        res.render("articles", { article, message: req.flash('warning') })
    })
  }