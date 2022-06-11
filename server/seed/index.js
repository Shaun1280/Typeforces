const {
  sequelize,
  User,
  Round,
  Practice,
  Content,
  Friend,
  CompetitionHistory
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
        if (user.rating) {
          return User.create({
            id: uuid.v4(),
            email: user.email,
            password: user.password,
            user_name: user.user_name,
            rating: user.rating,
            status: user.status,
            country: user.country,
            register_time: Date.parse(new Date())
          })
        } else {
          return User.create({
            id: uuid.v4(),
            email: user.email,
            password: user.password,
            user_name: user.user_name,
            status: user.status,
            country: user.country,
            register_time: Date.parse(new Date())
          })
        }
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

    // insert test histories
    const testBots = await User.findAll({
      where: {
        status: 'bot'
      }
    })
    for (const bot of testBots) { // 不需要结果，可以用 for
      const rand1 = Math.floor(Math.random() * 10000)
      const rand2 = Math.round(Math.random() * 10000)
      await CompetitionHistory.create({
        round_no: 1,
        participant_id: bot.id,
        prev_rating: bot.rating,
        miss_count: 0,
        type_progress: 1,
        wpm: 70,
        score: (rand2 % 8) ? rand1 : null
      })
    }

    // for inserting practice
    const admin = await User.findOne({
      where: {
        user_name: 'admin'
      }
    })

    await Practice.create({
      practice_name: 'test1',
      content_id: '1',
      publish_time: new Date(),
      writer_id: admin.id
    })
    await Practice.create({
      practice_name: 'test2',
      content_id: '1',
      publish_time: new Date(),
      writer_id: admin.id
    })

    // friend
    const shaun = await User.findOne({
      where: {
        user_name: 'shaun'
      }
    })

    const shane = await User.findOne({
      where: {
        user_name: 'shane'
      }
    })

    await Friend.create({
      id1: shaun.id < shane.id ? shaun.id : shane.id,
      id2: shaun.id < shane.id ? shane.id : shaun.id,
      created_time: new Date()
    })
  })
