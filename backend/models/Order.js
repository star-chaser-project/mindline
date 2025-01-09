const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('../utils')

// schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  article: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  favourite: {
    type: Boolean,
    required: false
  },
  totalPrice: {
    type: Number,
    required: true
  },
  orderTime: {
    type: Number,
    required: true
  },
  orderCompleted: {
    type: Number,
    required: false,
  }

}, { timestamps: true })


// model
const orderModel = mongoose.model('Order', orderSchema)

// export
module.exports = orderModel