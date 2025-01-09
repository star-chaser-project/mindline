const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('../utils')

// schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  bodyContent: {
    type: String,    
  },
  mediaUrl: {
    type: String,
    required: false,
    default: null
  },
  
}, { timestamps: true })

//middleware
articleSchema.pre('save', function(next){
  console.log('document saved')
  if(this.Title) {
    this.Title = this.Title.toUpperCase();
  }
  next();
  if(this.type) {
    this.type = this.type.trim();
  }
  next();
  if(this.Content) {
    this.Content = this.Content.trim();
  }
})


// model
const articleModel = mongoose.model('Article', articleSchema)

// export
module.exports = articleModel