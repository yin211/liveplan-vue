<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import {AUTH_LOGOUT} from '@/store/actions/auth'

export default {
  name: 'App',
  created: function () {
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
  }
}
</script>
