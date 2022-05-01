const { Round } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const contests = await Round.findAll({
        where: {}
      })
      res.send(contests)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to get contests'
      })
    }
  },
  async post (req, res) {
    try {
      const contest = await Round.create(req.body)
      res.send(contest)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create contest',
        detail: err
      })
    }
  }
}
