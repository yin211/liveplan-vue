// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import i18n from './lang/lang'
import store from './store'
import axios from 'axios'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'font-awesome/css/font-awesome.css'
import Notifications from 'vue-notification'
Vue.use(Notifications)
Vue.use(BootstrapVue)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next('/error-404')
  } else {
    if (to.path !== '/login') {
      if (store.getters.isAuthenticated) {
        next()
        return
      }
      next('/login')
    } else {
      next()
    }
  }
})

const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
