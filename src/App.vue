<template>
  <div id="app">
    <v-header></v-header>
    <router-view></router-view>
    <v-footer></v-footer>
    <v-notify></v-notify>
  </div>
</template>

<script>
import axios from 'axios'
import {AUTH_LOGOUT} from '@/store/actions/auth'
import vheader from '@/components/header'
import vfooter from '@/components/footer'
import vnotify from '@/components/common/notify'

export default {
  name: 'app',
  components: {
    'v-header': vheader,
    'v-footer': vfooter,
    'v-notify': vnotify
  },
  created () {
    axios.interceptors.response.use(function (response) {
      return response
    }, function (error) {
      const originalRequest = error.config
      if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true
        const refreshToken = localStorage.getItem('user-token')
        if (refreshToken) {
          return axios.post(`${process.env.ROOT_API}/refresh`, { refreshToken })
            .then(({data}) => {
              window.localStorage.setItem('user-token', data.token)
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token
              originalRequest.headers['Authorization'] = 'Bearer ' + data.token
              return axios(originalRequest)
            })
        }
        this.$store.dispatch(AUTH_LOGOUT)
      }
      return Promise.reject(error)
    })
  }
}
</script>

<style lang="scss">
  @import './assets/scss/app.scss';
  @import './assets/fonts/solid.scss';
  @import './assets/fonts/stroke.scss';
  #app {
    font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    padding-top: 24px;
  }

</style>
