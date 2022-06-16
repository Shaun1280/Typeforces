const { User, CompetitionHistory, PracticeHistory, Practice, Round, Friend } = require('../models')

const { Op } = require('sequelize')

const passport = require('passport')

module.exports = {
  async index (req, res) {
    try {
      passport.authenticate('jwt', function (err, user) {
        if (err) {
          res.status(400).send({
            error: 'An error occurs when trying to get profile',
            detail: error
          })
        } else {
          req.user = user
        }
      })(req, res)

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

      const { count } = await Friend.findAndCountAll({
        where: {
          [Op.or]: [
            { id1: user.id },
            { id2: user.id }
          ],
          created_time: {
            [Op.not]: null
          }
        }
      })

      let isFriend = 0
      if (req.user) {
        let id1 = req.user.id
        let id2 = user.id
        isFriend = (await Friend.findAndCountAll({
          where: {
            id1: id1 < id2 ? id1 : id2,
            id2: id1 < id2 ? id2 : id1,
            created_time: {
              [Op.not]: null
            }
          }
        })).count
      }

      res.send({
        id: user.id,
        email: user.email,
        user_name: user.user_name,
        status: user.status,
        country: user.country,
        rating: user.rating,
        register_time: user.register_time,
        last_visit: user.last_visit,
        competitionHistories: competitionHistories,
        practiceHistories: practiceHistories,
        friendCount: count,
        isFriend: isFriend
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
