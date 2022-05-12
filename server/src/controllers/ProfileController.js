const { User, CompetitionHistory, PracticeHistory } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const userName = req.params.username
      const user = await User.findOne({
        where: {
          user_name: userName
        }
      })
      if (!user) {
        return res.status(500).send({
          error: 'User doesn\'t exist'
        })
      }
      const competitionHistories = await CompetitionHistory.findAll({
        where: {
          participant_id: user.id
        }
      })

      const practiceHistories = await PracticeHistory.findAll({
        where: {
          practicer_id: user.id
        }
      })

      res.send({
        email: user.email,
        user_name: user.user_name,
        status: user.status,
        country: user.country,
        rating: user.rating,
        register_time: user.register_time,
        last_visit: user.last_visit,
        competitionHistories: competitionHistories,
        practiceHistories: practiceHistories,
        friends: 0
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to get user profile',
        detail: err
      })
    }
  }
}
