const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const uuid = require('uuid')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async register (req, res) {
    try {
      let result = await User.findOne({
        where: {
          email: req.body.email
        }
      })
      if (result) {
        return res.status(400).send({
          error: 'The email is already in use'
        })
      }
      result = await User.findOne({
        where: {
          user_name: req.body.user_name
        }
      })
      if (result) {
        return res.status(400).send({
          error: 'This username is aleady in use'
        })
      }
      const user = await User.create({
        id: uuid.v4(),
        email: req.body.email,
        password: req.body.password,
        user_name: req.body.user_name,
        status: req.body.status,
        rating: 1500,
        country: req.body.country,
        register_time: req.body.register_time,
        last_visit: req.body.last_visit
      })
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(400).send({
        error: 'authentication error',
        detail: err
      })
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
