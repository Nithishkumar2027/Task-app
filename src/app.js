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
    res.json({ msg: 'Task app 👋' })
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

// Fetching all users
app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.json(users)
    }).catch((err) => {
        res.status(500).send()
    })
})

// Fetch particular user
app.get('/users/:id', (req, res) => {
    const _id = req.params.id
    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).json({
                msg: 'No user  found'
            })
        }
        res.send(user)
    }).catch((err) => {
        res.status(500).send()
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

// Fetching tasks
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.json(tasks)
    }).catch((err) => {
        res.status(500).send()
    })
})

// Fetching particular task
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).json({
                msg: 'Task not found'
            })
        }
        res.json(task)
    }).catch((err) => {
        res.status(500).send()
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running at port ${port}`))