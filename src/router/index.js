import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/dashboard'
import Login from '@/components/login'
import Expense from '@/components/expense'
import store from '@/store'

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
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'expense',
          name: 'Expense',
          component: Expense
        }
      ],
      beforeEnter: ifAuthenticated
    }
  ]
})
