var thinky = require('thinky')();
var type = thinky.type;
var CommentSchema = require('./Comments');

var PostSchema = thinky.createModel('Post', {
    id: type.string(),
    title: type.string(),
    link: type.string(),
    author: type.string(),
    upvotes: type.number().default(0)
});

PostSchema.hasMany(CommentSchema, 'comments', 'id', 'commentid');
CommentSchema.belongsTo(PostSchema, 'post', 'postid', 'id');

PostSchema.define('upvote', function (cb) {
    this.upvotes += 1;
    this.save(cb);
});

module.exports = PostSchema;