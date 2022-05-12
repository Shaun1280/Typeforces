const AuthenticationController = require('./controllers/AuthenticationController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

const ContestsController = require('./controllers/ContestsController')

const SearchController = require('./controllers/SearchController')

const ProfileController = require('./controllers/ProfileController')

module.exports = (app) => {
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/login', // no need of policy
    AuthenticationController.login)

  app.get('/contests',
    ContestsController.index)
  app.get('/contests/:id',
    ContestsController.show)
  app.post('/manage-contests',
    ContestsController.post)

  app.get('/search',
    SearchController.index)
  
  app.get('/profile/:username', ProfileController.index)
}
