import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import login from '@/components/auth/login'
import expense from '@/components/expense'

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
    },
    {
      path: '/expense',
      name: 'expense',
      component: expense
    }
  ],
  beforeEnter: ifAuthenticated
})
