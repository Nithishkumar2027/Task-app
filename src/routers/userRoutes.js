const express = require('express')
const router = express.Router()
const multer = require('multer')

const User = require('../models/User')
const auth = require('../middleware/auth')

// Creating user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).json({
            msg: 'Hurray! User created 🎉',
            user,
            token
        })
    } catch (err) {
        res.status(400).json({
            msg: 'Error in creating user',
            err
        })
    }
})

// Fetching Profile details
router.get('/users/me', auth, async (req, res) => {
    res.json(req.user)
})

// Updating particular user
router.patch('/users/me', auth, async (req, res) => {
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
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.json({
            msg: 'Profile updated 🎉',
            updatedProfile: req.user
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

// Deleting profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.json({ msg: 'Profile deleted', deletedProfile: req.user })
    } catch (err) {
        res.status(500).send()
    }
})

// User signin
router.post('/users/signin', async (req, res) => {
    const data = req.body
    try {
        const user = await User.findByCredentials(data.email, data.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (err) {
        res.status(400).send()
    }
})

// User signout in current session
router.post('/users/signout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.json({ msg: 'User Signed out' })
    } catch (err) {
        res.status(500).send()
    }
})

// User signout in all session
router.post('/users/signoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.json({ msg: 'Logged out from all sessions' })
    } catch (err) {
        res.status(500).send()
    }
})

// Uploading user profile pic
const upload = multer({
    dest: 'avatar'
})
router.post('/users/me/avatar', upload.single('upload'), (req, res) => {
    res.json({ msg: 'Picture uploaded successfully' })
})


module.exports = router