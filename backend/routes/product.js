const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Product = require('./../models/Product')
const path = require('path')

// GET- get all products ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
  Product.find().populate('user', '_id firstName lastName')
    .then(products => {
      if(products == null){
        return res.status(404).json({
          message: "No product found"
        })
      }
      res.json(products)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting products"
      })
    })  
})

// POST - create new product --------------------------------------
// endpoint - /product
router.post('/', (req, res) => {
  // validate 
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "Product content can't be empty"})
  }
  // validate - check if image file exist
  if(!req.files || !req.files.image){
    return res.status(400).send({message: "Image can't be empty"})
  }

  console.log('req.body = ', req.body)

  // image file must exist, upload, then create new product
  let uploadPath = path.join(__dirname, '..', 'public', 'images')
  Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
    // create new product
    let newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      user: req.body.user,
      image: uniqueFilename,
      milk: req.body.milk,
      size: req.body.size,
      shots: req.body.shots
    })
  
    newProduct.save()
    .then(product => {        
      // success!  
      // return 201 status with product object
      return res.status(201).json(product)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating product",
        error: err
      })
    })
  })
})


// export
module.exports = router
