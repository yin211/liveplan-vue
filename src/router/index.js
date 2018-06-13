import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import login from '@/components/auth/login'

Vue.use(Router)

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ],
  beforeEnter: ifAuthenticated
})
