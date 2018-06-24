import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/auth/login'
import notFound from '@/components/errors/404'
import assumptions from '@/components/assumptions'
import expense from '@/components/assumptions/expense'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
      path: '/error-404',
      name: 'notFound',
      component: notFound
    },
    {
      path: '/assumptions',
      name: 'assumptions',
      component: assumptions,
      children: [
        {
          path: 'expense',
          name: 'expense',
          component: expense
        }
      ]
    }
  ]
})
