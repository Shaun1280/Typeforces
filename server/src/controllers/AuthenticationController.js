const { User } = require('../models')

module.exports = {
  async register (req, res) {
    console.log(req.body)
    try {
      const user = await User.create(req.body)
      res.send(user.toJSON())
    } catch (err) {
      // email already exist
      console.log(err);
      res.status(400).send({
        error: 'This email account is aleady in use'
      })
    }
  }
}
