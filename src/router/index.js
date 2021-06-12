import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from '../views/Register'
import Projects from '../views/Projects'
import Logout from '../views/Logout'
import Workers from '../views/Workers'
import Profile from '../views/Profile'
import Settings from '../views/Settings'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/register',
    component: Register,
    name: 'register'
  },
  {
    path: '/',
    component: Projects,
    name: 'projects',
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/logout',
    component: Logout,
    name: 'logout'
  },
  {
    path: '/workers',
    component: Workers,
    name: 'workers',
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/profile/:id',
    component: Profile,
    name: 'profile',
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/settings',
    component: Settings,
    name: 'settings',
    meta: {
      requiresLogin: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
