const express = require('express')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp');

const User = require('../models/User')
const auth = require('../middleware/auth')
const { sendWelcomeEmail } = require('../emails/account')

// Creating user
router.post('/users', async (req, res) => {
	const user = new User(req.body)
	try {
		await user.save()
		sendWelcomeEmail(user.email, user.name)
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
	limits: {
		fileSize: 1000000 // filesize should be <= 1mb
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
			return cb(new Error('You have uploaded an invalid image file type'))
		}
		cb(undefined, true)
	}
})
router.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
	req.user.avatar = buffer

	await req.user.save()
	res.json({ msg: 'Picture uploaded successfully' })
}, (error, req, res, next) => {
	res.status(400).json({ error: error.message })
})

// Deleting profile picture
router.delete('/users/me/avatar', auth, async (req, res) => {
	try {
		req.user.avatar = undefined
		await req.user.save()
		res.json({ msg: 'Successfully removed profile picture', deletedPic: req.user.avatar })
	} catch (err) {
		res.status(500).send(err)
	}
})

// Fetching profile pics
router.get('/users/:id/avatar', async (req, res) => {
	const user = await User.findById(req.params.id)

	try {
		if (!user || !user.avatar) {
			throw new Error('Profile picture not found')
		}
		res.set('Content-Type', 'image/png')
		res.send(user.avatar)
	} catch (err) {
		res.status(404).json(err)
	}
})


module.exports = router