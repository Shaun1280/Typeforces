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
