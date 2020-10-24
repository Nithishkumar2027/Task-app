const express = require('express')
const router = express.Router()

const Task = require('../models/Task')

// Creating Task
router.post('/tasks', async (req, res) => {
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
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.json(tasks)
    } catch (err) {
        res.status(500).send()
    }

})

// Fetching particular task
router.get('/tasks/:id', async (req, res) => {
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

// Updating a particular Task
router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    // Validations
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).json({ msg: 'Ivalid update' })
    }

    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send()
        }

        res.json({
            msg: 'Task updated',
            task
        })
    } catch (err) {
        res.status(500).send()
    }
})

// Deleting a task
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id)
        if (!task) {
            return res.status(400).send()
        }
        res.json({ msg: 'Task deleted', task })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router