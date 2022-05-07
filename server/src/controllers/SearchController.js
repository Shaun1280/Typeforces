const { Round, User } = require('../models')
const { Op } = require("sequelize");

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
                  [Op.like]: `%${search}%`,
                }
              },
              {
                round_no: {
                  [Op.like]: `%${search}%`,
                }
              }
            ]
          }
        })
        const users = await User.findAll({
          where: {
            user_name: {
              [Op.like]: `%${search}%`,
            }
          }
        })
        res.send({
          contests: contests,
          users: users,
          serverTime: (new Date()).getTime()
        })
      } else {
        res.send({
          contests: null,
          users: null,
          serverTime: (new Date()).getTime()
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to search',
        detail: err
      })
    }
  }
}
