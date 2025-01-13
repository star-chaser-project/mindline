const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const Article = require('../models/Article')

// GET - get user's bookmarked articles
router.get('/', Utils.authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id

    const user = await User.findById(userId)
      .populate('bookmarkArticle')
      .select('bookmarkArticle')

    if (!user || !user.bookmarkArticle.length) {
      return res.status(404).json({
        message: "No bookmarked articles found"
      })
    }

    res.json(user.bookmarkArticle)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Problem getting bookmarked articles"
    })
  }
})

// PUT - Update the favourite field of an order
// Endpoint: /user/bookmarkArticle/:id
router.put('/bookmark/:articleId', Utils.authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id
    const articleId = req.params.articleId

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { bookmarkArticle: articleId } },
      { new: true }
    ).populate('bookmarkArticle')


    res.json(updatedUser)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Problem bookmarking article"})
  }
})


// DELETE - remove an article from the bookmark list
router.delete('/bookmark/:articleId', Utils.authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id
    const articleId = req.params.articleId

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarkArticle: articleId } },
      { new: true }
    ).populate('bookmarkArticle')   

    res.json(updatedUser)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Problem removing article from bookmark"})
  }
})


// export
module.exports = router