const { User, CompetitionHistory } = require('../models')

function calcContestWpm (competitionHistory) {
  return 0
}

function calcPracticeWpm (practiceHistory) {
  return 0
}

module.exports = {
  async index (req, res) {
    try {
      const user_name = req.params.username;
      const user = await User.findOne({
        where: {
          user_name: user_name
        }
      })
      if (!user) {
        return res.status(500).send({
          error: `User doesn't exist`
        })
      }
      const competitionHistory = await CompetitionHistory.findAll({
        where: {
          participant_id: user.id
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
        contest_wpm: calcContestWpm(competitionHistory),
        practice_wpm: 0,
        max_rating: 1500,
        average_accuracy: 100,
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
  