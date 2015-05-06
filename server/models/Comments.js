var thinky = require('thinky')();
var type = thinky.type;

var CommentSchema = thinky.createModel('Comment', {
    body: type.string(),
    author: type.string(),
    upvotes: type.number().default(0)
});

CommentSchema.define('upvote', function (cb) {
    this.upvotes += 1;
    this.save(cb);
});

module.exports = CommentSchema;