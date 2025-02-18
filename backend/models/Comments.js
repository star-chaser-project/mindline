const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('../utils')

// Comment Schema
const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {timestamps: true })

// Middleware
commentSchema.pre('save', function(next){
    //console.log('document saved')
    if(this.comment) {
        this.comment = this.comment.trim();
    }
    next();
})

const commentModel = mongoose.model('Comments', commentSchema)

module.exports = commentModel