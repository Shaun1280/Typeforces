const { Round, User, Practice } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  async index (req, res) {
    try {
      const search = req.query.search
      if (search) {
        const contests = await Round.findAll({
          where: {
            [Op.or]: [
              {
                round_name: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                round_no: {
                  [Op.like]: `%${search}%`
                }
              }
            ]
          }
        })
        const users = await User.findAll({
          where: {
            user_name: {
              [Op.like]: `%${search}%`
            }
          }
        })
        const practices = await Practice.findAll({
          include: [
            {
              attributes: ['user_name', 'rating'],
              model: User
            }
          ],
          where: {
            practice_name: {
              [Op.like]: `%${search}%`
            }
          }
        })
        res.send({
          contests: contests,
          users: users,
          practices: practices,
          serverTime: (new Date()).getTime()
        })
      } else {
        res.send({
          contests: null,
          users: null,
          practices: null,
          serverTime: (new Date()).getTime()
        })
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to search',
        detail: err
      })
    }
  }
}
