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

// Testing creation of web token
const myFunction = async () => {
    const token = jwt.sign({ _id: 'gumbi' }, 'secret', { expiresIn: '5 seconds' })
    console.log(token)

    // To verify the token
    const data = jwt.verify(token, 'secret')
    console.log(data)
}

myFunction()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running at port ${port}`))