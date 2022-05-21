import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Contests from '@/components/contests/Contests'
import ViewContest from '@/components/contests/ViewContest'
import ViewStanding from '@/components/contests/ViewStanding'
import ManageContests from '@/components/contests/ManageContests'
import Profile from '@/components/Profile'
import Search from '@/components/Search'
import Rating from '@/components/rating/Rating'

Vue.use(Router)

const originalPush = Router.prototype.push

Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: HelloWorld
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/Profile/:username',
      name: 'profile',
      component: Profile
    },
    {
      path: '/Contests',
      name: 'contests',
      component: Contests
    },
    {
      path: '/ManageContests',
      name: 'manageContests',
      component: ManageContests
    },
    {
      path: '/Contests/:id',
      name: 'viewContest',
      component: ViewContest
    },
    {
      path: '/Contests/Standing/:id',
      name: 'viewStanding',
      component: ViewStanding
    },
    {
      path: '/Search',
      name: 'Search',
      component: Search
    },
    {
      path: '/*',
      redirect: '/'
    },
    {
      path: '/Rating',
      name: 'rating',
      component: Rating
    }
  ]
})
