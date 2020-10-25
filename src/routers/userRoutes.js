const express = require('express')
const router = express.Router()

const User = require('../models/User')

// Creating user
router.post('/users', async (req, res) => {
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
router.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.json(users)
    } catch (err) {
        res.status(500).send()
    }

})

// Fetch particular user
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
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
        const user = await User.findById(_id)

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

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

// Deleting a user
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return res.status(400).send()
        }
        res.json({ msg: 'User deleted', user })
    } catch (err) {
        res.status(500).send()
    }
})


module.exports = router