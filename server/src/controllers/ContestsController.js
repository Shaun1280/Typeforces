const { Round, Content } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const contests = await Round.findAll({
        where: {}
      })
      res.send({
        contests: contests,
        serverTime: (new Date()).getTime()
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to get contests'
      })
    }
  },
  async post (req, res) {
    try {
      const round = await Round.findOne({
        where: {
          round_name: req.body.round_name
        }
      })

      if (round) {
        return res.status(500).send({
          error: 'RoundName has already existed'
        })
      }

      const content = await Content.create({
        content: req.body.content
      })
      const contest = await Round.create({
        round_name: req.body.round_name,
        start_time: req.body.start_time,
        division: req.body.division,
        duration: req.body.duration,
        content_id: content.id
      })
      res.send({
        contest: contest,
        content: content
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create contest',
        detail: err
      })
    }
  }
}
