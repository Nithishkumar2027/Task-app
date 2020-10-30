const mongoose = require('mongoose')

// DB connection
const mongoURL = process.env.MONGO_URL
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)