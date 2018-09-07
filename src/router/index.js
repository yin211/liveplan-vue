import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/auth/login/index.vue'
import notFound from '@/components/errors/404'
import comingSoon from '@/components/errors/coming-soon'
import assumptions from '@/components/assumptions'
import expenses from '@/components/assumptions/expenses/index.vue'
import viewExpense from '@/components/assumptions/expenses/view/index.vue'
import addExpense from '@/components/assumptions/expenses/wizard/index.vue'
import incomes from '@/components/assumptions/incomes/index.vue'
import viewIncome from '@/components/assumptions/incomes/view/index.vue'
import addIncome from '@/components/assumptions/incomes/wizard/index.vue'
import assets from '@/components/assumptions/assets/index.vue'
import addAsset from '@/components/assumptions/assets/wizard/index.vue'
import debts from '@/components/assumptions/debts/index.vue'
import addDebt from '@/components/assumptions/debts/wizard/index.vue'
import overview from '@/components/overview/index.vue'

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
      path: '/overview',
      name: 'overview',
      component: overview
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
          path: 'expenses/add-expense',
          name: 'addExpense',
          component: addExpense
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
          path: 'incomes/add-income',
          name: 'addIncome',
          component: addIncome
        },
        {
          path: 'incomes/:id',
          name: 'viewIncome',
          component: viewIncome
        },
        {
          path: 'assets',
          name: 'assets',
          component: assets
        },
        {
          path: 'assets/add-asset',
          name: 'addAsset',
          component: addAsset
        },
        {
          path: 'debts',
          name: 'debts',
          component: debts
        },
        {
          path: 'debts/add-debt',
          name: 'addDebt',
          component: addDebt
        }
      ]
    }
  ]
})
