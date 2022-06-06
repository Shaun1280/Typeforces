const {
  sequelize,
  User,
  Round,
  Content
} = require('../src/models')

const Promise = require('bluebird')
const users = require('./users.json')
const rounds = require('./rounds.json')
const contents = require('./contents.json')
const uuid = require('uuid')

sequelize.sync({ force: true })
  .then(async function () {
    await Promise.all(
      users.map(user => {
        return User.create({
          id: uuid.v4(),
          email: user.email,
          password: user.password,
          user_name: user.user_name,
          status: user.status,
          country: user.country,
          register_time: Date.parse(new Date())
        })
      })
    )

    await Promise.all(
      contents.map(content => {
        return Content.create(content)
      })
    )

    await Promise.all(
      rounds.map(round => {
        return Round.create({
          round_name: round.round_name,
          start_time: Date.parse(new Date('2022/05/02 00:00:00')),
          duration: round.duration,
          content_id: round.content_id,
          division: round.division
        })
      })
    )
  })
