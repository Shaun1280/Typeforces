const { User } = require('../models')

module.exports = {
  async register (req, res) {
    try {
      const user = await User.create(req.body)
      res.send(user.toJSON())
    } catch (err) {
      // email already exist
      res.status(400).send({
        error: 'This email account is aleady in use'
      })
    }
  }
}
