const AuthenticationController = require('./controllers/AuthenticationController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

const ContestsController = require('./controllers/ContestsController')

module.exports = (app) => {
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/login', // no need of policy
    AuthenticationController.login)

  app.get('/contests',
    ContestsController.index)
  app.post('/manage-contests',
    ContestsController.post)
}
