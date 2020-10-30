const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, username) => {
	const msg = {
		to: email,
		from: 'kumar20272602@gmail.com',
		subject: 'Account created 🎉',
		html: `<h3>Hi, ${username} 👋</h3> Let me know how you get along with the app.`,
	}
	sgMail
		.send(msg)
		.then(() => console.log('Welcome Email sent successfully'))
		.catch(err => console.log('Error occured: ', err))
}
const sendCancellationEmail = (email, username) => {
	const msg = {
		to: email,
		from: 'kumar20272602@gmail.com',
		subject: "We're Sorry to see you go 😢",
		html: `<h3>Hi, ${username} 👋.</h3> We're just confirming that you're account has been deleted. We hope you to come back soon.`,
	}
	sgMail
		.send(msg)
		.then(() => console.log('Cancellation Email sent successfully'))
		.catch(err => console.log('Error occured: ', err))
}

module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail
}