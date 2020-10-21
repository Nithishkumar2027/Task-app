// Importing packages
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// Importing connection 
require('./db/mongoose')

// Importing models
const User = require('./models/User')
const Task = require('./models/Task')

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
    res.json({ msg: 'Task app 👋'})
})

// Creating user
app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then((result) => {
        res.status(201).json({
            msg: 'Hurray! User created 🎉',
            result
        })
    }).catch((err) => {
        res.status(400).json({
            msg: 'Error in creating user',
            err
        })
    })
})

// Creating Task
app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then((result) => {
        res.status(201).json({
            msg: 'Task created successfully 🔥',
            result
        })
    }).catch((err) => {
        res.status(400).json({
            msg: 'Error in creating Task',
            err
        })
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running at port ${port}`))