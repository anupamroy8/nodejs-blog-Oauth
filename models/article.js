var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    image: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    tags: [String],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }]
},{timestamps: true});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;
