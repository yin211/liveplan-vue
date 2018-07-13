import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/auth/login/index.vue'
import notFound from '@/components/errors/404'
import comingSoon from '@/components/errors/coming-soon'
import assumptions from '@/components/assumptions'
import expense from '@/components/assumptions/expense/index.vue'

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
      path: '/coming-soon',
      name: 'comingSoon',
      component: comingSoon
    },
    {
      path: '/assumptions',
      name: 'assumptions',
      component: assumptions,
      children: [
        {
          path: 'expenses/:id',
          name: 'expenses',
          component: expense
        }
      ]
    }
  ]
})
