const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('../utils')

// schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,    
  },
  price: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  image: {
    type: String,
    required: true    
  },
  size: {
    type: String,
    required: true
  },
  milk: {
    type: String,
    required: true
  },
  shots: {
    type: Number,
    required: true
  }
  
}, { timestamps: true })


// model
const productModel = mongoose.model('Product', productSchema)

// export
module.exports = productModel