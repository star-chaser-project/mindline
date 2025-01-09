const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const Article = require('../models/Article')
const path = require('path')



// GET- get all article ---------------------------
router.get('/', (req, res) => {
  Article.find()
    .then(article => {
      if(article == null){
        return res.status(404).json({
          message: "No article found"
        })
      }
      res.json(article)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting article"
      })
    })  
})

// POST - create new article --------------------------------------
// endpoint - /article
router.post('/', (req, res) => {
  // Log the request body
  console.log('req.body = ', req.body)

    // Determine type based on mediaUrl presence
    const articleType = req.body.mediaUrl ? 'video' : req.body.type
  
  // Create new Article instance
  const newArticle = new Article({
    title: req.body.title,
    type: req.body.mediaUrl ? 'video' : req.body.type,
    bodyContent: req.body.bodyContent,
    mediaUrl: req.body.mediaUrl || null
  })

  // Save the article
  newArticle.save()
    .then(article => {
      res.json(article)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem creating article"
      })
    })
})



// export
module.exports = router
