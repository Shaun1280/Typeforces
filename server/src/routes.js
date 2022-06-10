const AuthenticationController = require('./controllers/AuthenticationController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

const ContestsController = require('./controllers/ContestsController')

const SearchController = require('./controllers/SearchController')

const ProfileController = require('./controllers/ProfileController')

const RatingController = require('./controllers/RatingController')

const isAuthenticated = require('./policies/isAuthenticated')

module.exports = (app) => {
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/login', // no need of policy
    AuthenticationController.login)
  app.post('/checkLogin',
    isAuthenticated,
    (req, res) => { return res.send('is logged in') })

  app.get('/contests',
    ContestsController.index)
  app.get('/contests/:id',
    isAuthenticated,
    ContestsController.show)
  app.get('/contests/standing/:id',
    isAuthenticated,
    ContestsController.getStanding)
  app.post('/contests/history/:id',
    isAuthenticated,
    ContestsController.postHistory)
  app.post('/manage-contests',
    isAuthenticated,
    ContestsController.post)
  app.put('/manage-contests',
    isAuthenticated,
    ContestsController.put)
  app.delete('/manage-contests/:id',
    isAuthenticated,
    ContestsController.delete)
  app.get('/manage-contests',
    isAuthenticated,
    ContestsController.get)

  app.get('/search',
    SearchController.index)

  app.get('/profile/:username', ProfileController.index)

  app.get('/rating', RatingController.index)
  app.post('/forceUpdateRating',
    isAuthenticated,
    RatingController.forceUpdateRating)
}
