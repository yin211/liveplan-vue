import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/auth/login'
import assumptions from '@/components/assumptions'
import expense from '@/components/assumptions/expense'

Vue.use(Router)

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
