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
  try {
    // Standardize field names and cleanup
    if(this.title) {
      this.title = this.title.trim()
    }
    if(this.type) {
      this.type = this.type.trim()
    }
    if(this.bodyContent) {
      this.bodyContent = this.bodyContent.trim()
    }
    next()
  } catch(err) {
    next(err)
  }
})


// model
const articleModel = mongoose.model('Article', articleSchema)

// export
module.exports = articleModel