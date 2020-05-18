var express = require('express');
var router = express.Router();

// model
var Comment = require("../models/comment")
var Article = require("../models/article")

// var commentRouter = require('./comments')

router.get("/:id/edit", (req, res, next)=> {
    req.body.author = req.UserInfo.id;
    // console.log(req.UserInfo, req.body);
    
    Comment.findById(req.params.id, (err, comment)=> {
        if(err) return next(err);
        // console.log(comment);
        res.render("editCommentForm", { comment });
    })
})

router.post("/:id", (req, res, next)=> {
    // console.log(req.body);
    req.body.author = req.UserInfo.id;
    Comment.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err, comment)=>{
        if(err) return next(err);
        
        res.redirect(`/articles/${comment.articleId}#comment`);
    })
})

router.get("/:commentId/delete", (req,res, next)=> {
    var commentId= req.params.commentId;
    Comment.findByIdAndDelete(commentId, (err, deletedComment)=>{
        if(err) return next(err);
        Article.findByIdAndUpdate(deletedComment.articleId, 
            {$pull: { comments: deletedComment.id}}, 
            (err, updatedArticle)=>{
                if(err) return next(err);
            } 
        );
        res.redirect(`/articles/${deletedComment.articleId}#comment`);
    })
})

module.exports = router;