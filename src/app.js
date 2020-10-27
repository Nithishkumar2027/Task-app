const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')

// Importing connection 
require('./db/mongoose')

// Importing models
const User = require('./models/User')
const Task = require('./models/Task')

// Importing Routers
const userRouter = require('./routers/userRoutes')
const taskRouter = require('./routers/taskRoutes')

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use(userRouter)
app.use(taskRouter)

app.get('/', (req, res) => {
    res.json({ msg: 'Task app 👋' })
})

// Testing relationship

const test = async () => {
    const task = await Task.findById('5f9868f8d1f9e239b8a57d0c')
    await task.populate('createdBy').execPopulate()
    // console.log(task)

    const user = await User.findById('5f985d02bccdfb513c6be0e4')
    await user.populate('tasks').execPopulate()
    console.log({ 1: task, 2: user.tasks })
}
test()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running at port ${port}`))