import Vue from 'vue'
import Router from 'vue-router'

import Index from './pages/Index.vue'
import Login from './pages/Login.vue'
import Dashboard from './pages/Dashboard.vue'
import store from './store.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.getters.loggedIn) {        
          next()
          return
      }
      next('/login')
  } else {
      next()
  }
})

export default router
