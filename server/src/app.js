const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { sequelize } = require('./models')
const config = require('./config/config')

const app = express()
app.use(morgan('combine'))
app.use(bodyParser.json())
app.use(cors())

app.get('/status', (req, res) => {
  res.send({
    message: 'hello world'
  })
})

require('./routes')(app)

sequelize.sync({ force: true })
  .then(() => {
    app.listen(process.env.PORT || 8081)
    console.log(`Server started on port ${config.port}`)
  })
