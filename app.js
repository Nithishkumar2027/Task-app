const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
    res.json({ msg: 'Task app 👋'})
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running at port ${port}`))