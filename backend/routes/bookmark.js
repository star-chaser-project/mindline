const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const User = require('../models/User')  // ✅ Missing import fixed
const Article = require('../models/Article')

// ✅ GET - Fetch user's bookmarked articles
router.get('/', Utils.authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id

    const user = await User.findById(userId)
      .populate('bookmarkArticle')
      .select('bookmarkArticle')

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user.bookmarkArticle || []) // ✅ Always return 200 with an array
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Problem getting bookmarked articles" })
  }
})

// ✅ PUT - Add an article to bookmarks
router.put('/:articleId', Utils.authenticateToken, async (req, res) => {
  try {
    const { action } = req.body;
    const articleId = req.params.articleId;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      action === 'remove' 
        ? { $pull: { bookmarkArticle: articleId } }
        : { $addToSet: { bookmarkArticle: articleId } },
      { new: true }
    ).populate('bookmarkArticle');

    res.json({
      message: action === 'remove' ? 'Article removed from bookmarks' : 'Article bookmarked successfully',
      bookmarks: updatedUser.bookmarkArticle
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Problem updating bookmark", error: err.message });
  }
});

// ✅ DELETE - Remove an article from bookmarks
router.delete('/:articleId', Utils.authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id
    const articleId = req.params.articleId

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarkArticle: articleId } },
      { new: true }
    ).populate('bookmarkArticle')

    res.json({
      message: "Article removed from bookmarks",
      bookmarks: updatedUser.bookmarkArticle
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Problem removing article from bookmarks" })
  }
})

module.exports = router