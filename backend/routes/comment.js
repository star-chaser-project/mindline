const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const Comment = require('../models/Comments')
const Post = require('./../models/Posts')





// get all comments //
router.get('/', (req, res) => {
    Comment.find()
        .then(comments => {
            res.json(comments)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Couldn't get comments",
                error: err
            })
        })
});

// Route handler for POST requests to '/'
router.post('/', Utils.authenticateToken, async (req, res) => {
    try {
        // Create a new comment
        const comment = new Comment({
            author: req.user._id,
            comment: req.body.comment.comment
        });
        await comment.save();

        // Find the post and add the comment's ObjectId to the post's comments array
        const post = await Post.findById(req.body.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        post.comments.push(comment._id);
        await post.save();

        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Couldn't create comment",
            error: err
        });
    }
});

module.exports = router