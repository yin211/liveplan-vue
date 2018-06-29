<template>
  <div id="app">
    <v-header class="bg-dark"></v-header>
    <div class="container main-box">
      <router-view></router-view>
      <v-footer class="bg-dark" v-if="isAuthenticated"></v-footer>
    </div>
    <notifications group="notify" classes="notify-style"/>
  </div>
</template>

<script>
import axios from 'axios'
import {AUTH_LOGOUT} from '@/store/actions/auth'
import vheader from '@/components/header'
import vfooter from '@/components/footer'

export default {
  name: 'app',
  components: {
    'v-header': vheader,
    'v-footer': vfooter
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
          return axios.post('https://api.livsplan.se/api/v1/refresh', { refreshToken })
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
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>

<style lang="scss">
  @import './assets/scss/app.scss';
  #app {
    font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100vh;
    padding-top: 24px;

    .main-box {
      max-width: 1400px;
      padding-left: 0px;
      padding-right: 0px;
    }
  }

</style>
