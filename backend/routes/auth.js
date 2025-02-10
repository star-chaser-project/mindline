require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('./../models/User')
const Utils = require('./../utils')
const jwt = require('jsonwebtoken')

// POST /signin ---------------------------------------
router.post('/signin', (req, res) => {
  // Debug logging
  console.log('Signin request body:', req.body)

  // 1. check if email and password are empty
  if (!req.body.email || !req.body.password) {     
    return res.status(400).json({message: "Please provide email and password"})
  }
  // 2. continue to check credentials
  User.findOne({email: req.body.email})
    .then(async user => {
      if (!user) return res.status(400).json({message: 'No account found'})     
      
      try {
        if (Utils.verifyHash(req.body.password, user.password)) {
          let payload = { _id: user._id }
          let accessToken = Utils.generateAccessToken(payload)        
          user.password = undefined
          return res.json({
            accessToken: accessToken,
            user: user
          })
        } else {
          return res.status(400).json({
            message: "Password / Email incorrect"
          })        
        }
      } catch (error) {
        console.log('Password verification error:', error)
        return res.status(500).json({
          message: "Error during authentication",
          error: error.message
        })
      }
    })
    .catch(err => {
      console.log('Database error:', err)
      res.status(500).json({
        message: "Error finding account",
        error: err.message
      })
    })
})


// GET /validate --------------------------------------
router.get('/validate', (req, res) => {   
  // get token
  let token = req.headers['authorization'].split(' ')[1];
  // validate token using jwt
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
    if(err){
      console.log(err)
      return res.status(401).json({
        message: "Unauthorised"
      })
    }

    // token valid - send back to payload/authData as json
    User.findById(authData._id)
      .then(user => {
        // remove password field (never send this back!)
        user.password = undefined
        res.json({
          user: user
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: "problem validating token",
          error: err
        })
      })
  })
})


  
module.exports = router