const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Product = require('./../models/Product')
const Order = require('./../models/Order')
const path = require('path')

// GET- get all orders ---------------------------
//router.get('/', Utils.authenticateToken, (req, res) => {
  //Order.find().populate('user', '_id firstName lastName', 'product', '_id name',)
    //.then(orders => {
      //if(orders == null){
        //return res.status(404).json({
          //message: "No order found"
        //})
      //}
      //res.json(orders)
    //})
    //.catch(err => {
      //console.log(err)
      //res.status(500).json({
       // message: "Problem getting orders"
      //})
    //})  
//})


// GET - get all orders ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
  Order.find()
    .populate('user', '_id firstName lastName') 
    .populate('product', '_id name') 
    .then(orders => {
      if (!orders || orders.length === 0) {
        return res.status(404).json({
          message: "No orders found"
        });
      }
      res.json(orders);
    })
    .catch(err => {
      console.error(err); 
      res.status(500).json({
        message: "Problem getting orders"
      });
    });
});

// PUT - Update the favourite field of an order
// Endpoint: /user/addFavProduct/:id
router.put('/addFavProduct/:id', Utils.authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { favourite } = req.body;

    // Validate inputs
    if (!id) {
      return res.status(400).json({
        message: "No order ID specified",
      });
    }


    // Update the favorite field in the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { favourite },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Respond with success message
    res.status(200).json({
      message: "Favourite status updated successfully",
      updatedOrder,
    });
  } catch (err) {
    console.error("Error updating favourite status:", err);
    res.status(500).json({
      message: "Problem updating favourite status",
      error: err.message,
    });
  }
});


// POST - create new order --------------------------------------
// endpoint - /order
router.post('/', (req, res) => {
  // validate 
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "Order content can't be empty"})
  }
  // validate - check if image file exist
  if(!req.files || !req.files.image){
    return res.status(400).send({message: "Image can't be empty"})
  }

  console.log('req.body = ', req.body)

  // image file must exist, upload, then create new product
  let uploadPath = path.join(__dirname, '..', 'public', 'images')
  Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
    // create new order
    let newOrder = new Order({
      user: req.body.user,
      image: uniqueFilename,
      name: req.body.name,
      price: req.body.price,
      totalPrice: req.body.totalPrice,
      favourite: req.body.favourite,
      orderTime: req.body.orderTime,
      orderCompleted: req.body.orderCompleted
    })
  
    newOrder.save()
    .then(order => {        
      // success!  
      // return 201 status with oder object
      return res.status(201).json(order)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating order",
        error: err
      })
    })
  })
})


// export
module.exports = router