const { User, CompetitionHistory, PracticeHistory, Practice, Round } = require('../models')

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

      CompetitionHistory.belongsTo(Round, {
        foreignKey: 'round_no',
        targetKey: 'round_no'
      })
      const competitionHistories = await CompetitionHistory.findAll({
        include: {
          attributes: ['round_name'],
          model: Round
        },
        where: {
          participant_id: user.id
        }
      })

      PracticeHistory.belongsTo(Practice, {
        foreignKey: 'practice_no',
        targetKey: 'practice_no'
      })
      const practiceHistories = await PracticeHistory.findAll({
        include: {
          attributes: ['practice_name'],
          model: Practice
        },
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
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to get user profile',
        detail: err
      })
    }
  }
}
