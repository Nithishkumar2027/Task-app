const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, username) => {
	const msg = {
		to: email,
		from: 'kumar20272602@gmail.com',
		subject: 'Account created 🎉',
		text: 'Thanks for joining in',
		html: `<strong>Hi, ${username} 👋</strong> Let me know how you get along with the app.`,
	}
	sgMail
		.send(msg)
		.then(() => console.log('Welcome Email sent successfully'))
		.catch(err => console.log('Error occured: ', err))
}

module.exports = {
	sendWelcomeEmail
}