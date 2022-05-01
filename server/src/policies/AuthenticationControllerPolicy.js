const Joi = require('joi')

module.exports = {
  async register (req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().regex(
        /^[a-zA-Z0-9]{8,32}/
      ),
      user_name: Joi.string().regex(
        /^[a-zA-Z0-9_]{3,24}/
      )
    })

    try {
      await schema.validateAsync(req.body)
      next()
    } catch (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).send({
            error: 'You must provide a validate email address!'
          })
          break

        case 'password':
          res.status(400).send({
            error: `The password provided failed to match the following rules:
              <br>
              1. It must contain only the following characters: a-z, A-Z, 0-9.
              <br>
              2. It must be at least 8 characters in length and not greater than 32 characters in length.
            `
          })
          break

        case 'user_name':
          res.status(400).send({
            error: `The username provided failed to match the following rules:
            <br>
            1. It must contain only the following characters: a-z, A-Z, 0-9, _.
            <br>
            2. It must be at least 3 characters in length and not greater than 24 characters in length.
          `
          })
          break

        default:
          res.status(400).send({
            error: 'Invalid registration information'
          })
      }
    }
  }
}
