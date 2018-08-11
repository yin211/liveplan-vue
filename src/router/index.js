import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/auth/login/index.vue'
import notFound from '@/components/errors/404'
import comingSoon from '@/components/errors/coming-soon'
import assumptions from '@/components/assumptions'
import expenses from '@/components/assumptions/expenses/index.vue'
import viewExpense from '@/components/assumptions/expenses/view/index.vue'
import incomes from '@/components/assumptions/incomes/index.vue'
import assets from '@/components/assumptions/assets/index.vue'
import debts from '@/components/assumptions/debts/index.vue'

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
          path: 'expenses',
          name: 'expenses',
          component: expenses
        },
        {
          path: 'expenses/:id',
          name: 'viewExpense',
          component: viewExpense
        },
        {
          path: 'incomes',
          name: 'incomes',
          component: incomes
        },
        {
          path: 'assets',
          name: 'assets',
          component: assets
        },
        {
          path: 'debts',
          name: 'debts',
          component: debts
        }
      ]
    }
  ]
})
