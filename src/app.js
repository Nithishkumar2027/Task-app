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
app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).json({
            msg: 'Hurray! User created 🎉',
            user
        })
    } catch (err) {
        res.status(400).json({
            msg: 'Error in creating user',
            err
        })
    }
})

// Fetching all users
app.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.json(users)
    } catch (err) {
        res.status(500).send()
    }

})

// Fetch particular user
app.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).json({
                msg: 'No user found'
            })
        }

        res.send(user)
    } catch (err) {
        res.status(500).send()
    }

})

// Updating particular user
app.patch('/users/:id', async (req, res) => {
    const _id = req.params.id

    // Validation
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).json({
            msg: 'Ivalid updates!'
        })
    }

    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).send()
        }

        res.json({
            msg: 'User updated',
            user
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

// Creating Task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).json({
            msg: 'Task created successfully 🔥',
            task
        })
    } catch (err) {
        res.status(400).json({
            msg: 'Error in creating Task',
            err
        })
    }
})

// Fetching tasks
app.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.json(tasks)
    } catch (err) {
        res.status(500).send()
    }

})

// Fetching particular task
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).json({
                msg: 'Task not found'
            })
        }
        res.json(task)
    } catch (err) {
        res.status(500).send()
    }

})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running at port ${port}`))