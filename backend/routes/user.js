const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const User = require('../models/User')
const path = require('path')

// PUT - add favouriteProduct --------------------------------------
// endpoint = /user/addFavProduct
router.put('/addFavProduct/', Utils.authenticateToken, (req, res) => {  
  // validate check
  if(!req.body.productId){
    return res.status(400).json({
      message: "No product specified"
    })
  }
  // add productId to favouriteProducts field (array - push)
  // push = method that can add an item to an array
  User.updateOne({
    _id: req.user._id
  }, {
    $push: {
      favouriteProducts: req.body.productId
    }
  })
    .then((user) => {            
      res.json({
        message: "Product added to favourites"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem adding favourite product"
      })
    })
})


// GET - get single user -------------------------------------------------------
// router.get("/:id", Utils.authenticateToken, (req, res) => {
//   if (req.user._id != req.params.id) {
//     return res.status(401).json({
//       message: "Not authorised",
//     });
//   }

//   User.findById(req.params.id)
//     .then((user) => {
//       res.json(user);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         message: "Couldn't get user",
//         error: err,
//       });
//     });
// });


// GET - get single user -------------------------------------------------------
router.get("/:id", Utils.authenticateToken, (req, res) => {
  if (req.user._id != req.params.id) {
    return res.status(401).json({
      message: "Not authorised",
    });
  }

  User.findById(req.params.id)
  .populate({
      path: 'order',
      populate: {
        path: 'product', 

      }
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't get user",
        error: err,
      });
    });
});

// PUT - update user ---------------------------------------------
router.put('/:id', Utils.authenticateToken, (req, res) => {
  // validate request
  if(!req.body) return res.status(400).send("Task content can't be empty")
  
  let avatarFilename = null

  // if avatar image exists, upload!
  if(req.files && req.files.avatar){
    // upload avater image then update user
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
      avatarFilename = uniqueFilename
      // update user with all fields including avatar
      updateUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: avatarFilename,
        bio: req.body.bio,
        accessLevel: req.body.accessLevel
      })
    })
  }else{
    // update user without avatar
    updateUser(req.body)
    }
  
  // update User
  function updateUser(update){    
    User.findByIdAndUpdate(req.params.id, update, {new: true})
    .then(user => res.json(user))
    .catch(err => {
      res.status(500).json({
        message: 'Problem updating user',
        error: err
      })
    }) 
  }
})

// POST - create new user --------------------------------------
router.post('/', (req, res) => {
  // validate request
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "User content can not be empty"})
  }

  // check account when email doesn't already exist
  User.findOne({email: req.body.email})
  .then(user => {
    if( user != null ){
      return res.status(400).json({
        message: "email already in use, use different email address"
      })
    }
  // create new user       
  let newUser = new User(req.body)
  newUser.save()
    .then(user => {        
      // success!  
      // return 201 status with user object
      return res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating account",
        error: err
      })
    })
  })
})

module.exports = router