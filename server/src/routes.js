const AuthenticationController = require('./controllers/AuthenticationController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

const ContestsController = require('./controllers/ContestsController')
const PracticeController = require('./controllers/PracticeController')

const SearchController = require('./controllers/SearchController')

const ProfileController = require('./controllers/ProfileController')

const RatingController = require('./controllers/RatingController')

const isAuthenticated = require('./policies/isAuthenticated')

const FriendController = require('./controllers/FriendController')

const MessageController = require('./controllers/MessageController')

module.exports = (app) => {
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/login', // no need of policy
    AuthenticationController.login)
  app.post('/checkLogin',
    isAuthenticated,
    (req, res) => { return res.send('is logged in') })

  // contest
  app.get('/contests',
    ContestsController.index)
  app.get('/contests/:id',
    isAuthenticated,
    ContestsController.show)
  app.get('/contests/standing/:id',
    isAuthenticated,
    ContestsController.getStanding)
  app.get('/practices/standing/:id',
    isAuthenticated,
    PracticeController.getStanding)
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
  app.get('/practice-contest/:content_id/:contest_name',
    isAuthenticated,
    PracticeController.getByContest)

  // practice
  app.get('/practices', PracticeController.index)
  app.get('/practicesUser/:username', PracticeController.indexUser)
  app.get('/practices/:id',
    isAuthenticated,
    PracticeController.show)
  app.post('/practices/vote/:id', // vote
    isAuthenticated,
    PracticeController.vote)
  app.post('/practices/history/:id',
    isAuthenticated,
    PracticeController.postHistory)
  app.post('/manage-practices',
    isAuthenticated,
    PracticeController.post)
  app.post('/manage-practices',
    isAuthenticated,
    PracticeController.post)
  app.get('/manage-practices',
    isAuthenticated,
    PracticeController.get)
  app.put('/manage-practices',
    isAuthenticated,
    PracticeController.put)
  app.delete('/manage-practices/:id',
    isAuthenticated,
    PracticeController.delete)

  app.get('/search',
    SearchController.index)

  app.get('/profile/:username', ProfileController.index)

  app.get('/rating', RatingController.index)
  app.post('/forceUpdateRating',
    isAuthenticated,
    RatingController.forceUpdateRating)
  app.get('/friend', isAuthenticated, FriendController.index)
  app.delete('/friend', isAuthenticated, FriendController.remove)
  app.get('/message/check', isAuthenticated, MessageController.checkNew)
  app.get('/message/viewed', isAuthenticated, MessageController.getViewed)
  app.get('/message/unviewed', isAuthenticated, MessageController.getUnviewed)
  app.post('/message/new', isAuthenticated, MessageController.postNew)
  app.post('/message/set', isAuthenticated, MessageController.setViewed)
  // friend request
  app.post('/friend/req', isAuthenticated, FriendController.friendRequest)
  app.get('/friend/req', isAuthenticated, FriendController.getRequests)
  app.post('/friend/accept', isAuthenticated, FriendController.accept)
  app.post('/friend/refuse', isAuthenticated, FriendController.refuse)
}
