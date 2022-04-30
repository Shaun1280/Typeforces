import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Login from '@/components/Login'
import ViewContests from '@/components/contests/ViewContests'
import ManageContests from '@/components/contests/ManageContests'
import Profile from '@/components/Profile'

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
      path: '/Profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/Contests',
      name: 'contests',
      component: ViewContests
    },
    {
      path: '/ManageContests',
      name: 'manageContests',
      component: ManageContests
    }
  ]
})
