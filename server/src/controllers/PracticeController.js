const { User, Practice } = require('../models')

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
  },
  async post (req, res) { // for manage Practice
  },
  async put (req, res) { // for manage Practice
  },
  async delete (req, res) { // for manage Practice

  },
  async get (req, res) { // for manage Practice

  },
  async postHistory (req, res) { // 增加练习

  }
}
