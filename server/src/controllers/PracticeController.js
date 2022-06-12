const { User, Practice, Content, PracticeHistory } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const practices = await Practice.findAll({
        include: [
          {
            attributes: ['user_name', 'rating'],
            model: User
          }
        ],
        where: {}
      })
      res.send({
        practices: practices
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to get contests',
        detail: err
      })
    }
  },
  async show (req, res) { // specific practice
    try {
      const practice = await Practice.findOne({
        where: {
          practice_no: req.params.id
        }
      })
      const content = await Content.findOne({
        where: {
          content_id: practice.content_id
        }
      })
      res.send({
        practice: practice,
        content: content
      })
    } catch (err) {
      res.status(500).send({
        error: `An error has occured when trying to get practice${req.params.id}`,
        detail: err
      })
    }
  },
  async post (req, res) { // for manage Practice
    try {
      const userPractices = await Practice.findAll({
        where: {
          writer_id: req.user.id
        },
        order: [['practice_no', 'DESC']]
      })

      if (userPractices.length > 0 && (new Date()).getTime() -
        (new Date(userPractices[0].publish_time)).getTime() <
        7 * 24 * 3600 * 1000) {
        return res.status(500).send({
          error: 'You can create only one practice every 7 days'
        })
      }

      const check = await Practice.findOne({
        where: {
          practice_name: req.body.practice_name
        }
      })

      if (check) {
        return res.status(500).send({
          error: 'Practice name has already existed'
        })
      }

      const content = await Content.create({
        content: req.body.content
      })
      const practice = await Practice.create({
        practice_name: req.body.practice_name,
        writer_id: req.user.id,
        publish_time: Date.parse(new Date()),
        content_id: content.content_id
      })

      res.send({
        practice: practice,
        content: content
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create contest',
        detail: err
      })
    }
  },
  async put (req, res) { // for manage Practice
  },
  async delete (req, res) { // for manage Practice

  },
  async get (req, res) { // for manage Practice

  },
  async postHistory (req, res) { // 增加练习记录
    try {
      const history = await PracticeHistory.create({
        practice_no: req.params.id,
        practicer_id: req.user.id,
        miss_count: req.body.miss_count,
        wpm: req.body.wpm
      })
      res.send(history.toJSON())
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to insert or update competition history',
        detail: err
      })
    }
  }
}
