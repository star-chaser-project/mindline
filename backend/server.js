// dependencies------------------------------
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const port = process.env.PORT || 3000
const fileUpload = require('express-fileupload')


// database connection ----------------------
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false
})
  .then(() => console.log("db connected!"))
  .catch(err => console.error("db connection failed ", err))


// express app setup -----------------------
const app = express()
// Apply CORS as early as possible
app.use(cors()) // You can also restrict the origin if needed, e.g., cors({ origin: 'http://localhost:1234' })

// Then static files, body parsers, etc.
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }
}))

// routes ---------------------------------

// homepage
app.get('/', (req, res) => {
  res.send("Homepage")
})

// auth
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

// user
const userRouter = require('./routes/user')
app.use('/user', userRouter)

// article
const articleRouter = require('./routes/article')
app.use('/article', articleRouter)

// order
const bookmarkRouter = require('./routes/bookmark')
app.use('/bookmark', bookmarkRouter)

// run app listen on port --------------------
app.listen(port, () => {
  console.log("App running on port ", port)
})