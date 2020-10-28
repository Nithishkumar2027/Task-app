const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const Task = require('../models/Task')

// Creating Task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id
    })

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
router.get('/tasks', auth, async (req, res) => {

    try {
        // Both approaches will work [by find() and populate()]
        /* const tasks = await Task.find({ author: req.user._id })
           res.json(tasks) */
        await req.user.populate('tasks').execPopulate()
        res.json(req.user.tasks)
    } catch (err) {
        res.status(500).send()
    }

})

// Fetching particular task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, author: req.user._id })
        console.log('Task: ', task)
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

// Updating a particular Task
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    // Validations
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).json({ msg: 'Ivalid update' })
    }

    try {
        const task = await Task.findOne({ _id, author: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.json({
            msg: 'Task updated',
            task
        })
    } catch (err) {
        res.status(500).send()
    }
})

// Deleting a task
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id, author: req.user._id })
        if (!task) {
            return res.status(400).send()
        }
        res.json({ msg: 'Task deleted', task })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router