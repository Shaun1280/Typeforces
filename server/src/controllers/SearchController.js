const { Round, Content, User } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const search = req.query.search
      if (search) {
        const contests = await Round.findAll({
          where: {
            $or: [
              'round_name', 'round_no'
            ].map(key => ({
              [key]: {
                like: `%${search}%`,
              }
            }))
          }
        })
        const users = await User.findAll({
          where: {
            $or: [
                'user_name', 'email'
            ].map(key => ({
                [key]: {
                like: `%${search}%`,
                }
            }))
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
      res.status(500).send({
        error: 'An error has occured trying to search'
      })
    }
  }
}
