var express = require('express');
var passport = require('passport');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var Post = require('../models/Posts.js');
var Comment = require('../models/Comments.js');
var User = require('../models/Users.js');

/**
 * Middleware for getting a post by its id
 */
router.param('post', function (req, res, next, id) {
    Post.get(req.body.id).run().then(function (post) {
        req.post = post;
        return next();
    }).error(handleError(res));
});

/**
 * Middleware for getting a comment by its id
 */
router.param('comment', function (req, res, next, id) {
    Comment.get(req.body.id).run().then(function (comment) {
        req.comment = comment;
        return next();
    }).error(handleError(res));
});

/* GET home page. */
router.get(
    '/', function (req, res, next) {
        res.render('index', {title : 'Express'});
    }
);

/* GET Posts Rest Response */
router.get('/posts', function (req, res, next) {
    Post.run().then(function (result) {
        res.json(result);
    }).error(handleError(res));
});

/* POST Save a post object */
router.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;

    post.save().then(function (post) {
        res.json(post);
    }).error(handleError(res));
});

/* GET single post */
router.get('/posts/:post', function (req, res) {
    req.post.getJoin({ comments: true }).run().then(function (post) {
        res.json(post)
    }).error(handleError(res));
});

/* PUT upvote a post */
router.put('/posts/:post/upvote', auth, function (req, res, next) {
    req.post.upvote(function(err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

/* POST atach comment to post */
router.post('/posts/:post/comments', auth, function (req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;

    comment.save(function(err, comment) {
        if (err) {
            return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if (err) {
                return next(err);
            }

            res.json(comment);
        });
    });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function (req, res, next) {
    req.comment.upvote(function(err, comment) {
        if (err) {
            return (next);
        }

        res.json(comment);
    });
});

router.post('/register', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);

    user.save().then(function (result) {
        console.log(result);

        return res.json({ token: user.generateJWT() });
    });
});

router.post('/login', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.json({ token: user.generateJWT() });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

var handleError = function (res) {
    return function(error) {
        return res.send(500, {error: error.message});
    }
};

module.exports = router;
