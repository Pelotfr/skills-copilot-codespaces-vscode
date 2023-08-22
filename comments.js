// Create web server
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Post = mongoose.model('Post');
var User = mongoose.model('User');

// GET: /comments
// Get all comments
router.get('/', function(req, res, next) {
  Comment.find(function(err, comments){
    if(err){ return next(err); }

    res.json(comments);
  });
});

// POST: /comments
// Create new comment
router.post('/', function(req, res, next) {
  var comment = new Comment(req.body);

  comment.save(function(err, comment){
    if(err){ return next(err); }

    res.json(comment);
  });
});

// GET: /comments/:comment
// Get comment by id
router.get('/:comment', function(req, res, next) {
  req.comment.populate('author', function(err, comment) {
    if (err) { return next(err); }

    res.json(comment);
  });
});

// PUT: /comments/:comment/upvote
// Upvote comment
router.put('/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

// POST: /comments/:comment/replies
// Create new reply
router.post('/:comment/replies', function(req, res, next) {
  var reply = new Comment(req.body);
  reply.parent = req.comment;
  reply.save(function(err, reply){
    if(err){ return next(err); }

    req.comment.replies.push(reply);
    req.comment.save(function(err, comment) {
      if(err){ return next(err); }

      res.json(reply);
    });
  });
});

// GET: /comments/:comment/replies
// Get all replies to comment
router.get('/:comment/replies', function(req, res, next) {
  Comment.find({ parent: req.comment }, function(err, comments){
    if(err){ return next(err); }

    res.json(comments);
  });
});

// GET: /comments/:comment/replies/:reply
// Get reply by id
router.get('/:comment/replies/:reply', function(req, res, next) {
  req.reply.populate('author', function(err, reply) {
    if (err) { return next(err); }

    res.json(reply);
  });
});

// PUT