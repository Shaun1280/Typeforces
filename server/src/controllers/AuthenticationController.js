const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async register (req, res) {
    try {
      const user = await User.create(req.body)
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      if (err.errors[0].message === 'users.user_name must be unique') { // duplicate username
        res.status(400).send({
          error: 'The username is already in use'
        })
      } else if (err.errors[0].message === 'users.PRIMARY must be unique') { // email already exist
        res.status(400).send({
          error: 'This email account is aleady in use'
        })
      } else {
        res.status(400).send({
          error: 'authentication error',
          detail: err
        })
      }
    }
  },
  async login (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      if (!user) {
        return res.status(403).send({
          error: 'The login information was incorrect1'
        })
      }

      const passwordValid = await user.comparePassword(password)

      if (!passwordValid) {
        return res.status(403).send({
          error: 'The login information was incorrect2'
        })
      }

      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  }
}
