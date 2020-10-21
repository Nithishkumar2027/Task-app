const mongoose = require('mongoose')

// DB connection
const mongoURL = 'mongodb://localhost:27017/task-api'
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})