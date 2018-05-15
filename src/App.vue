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
    axios.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
        // if you ever get an unauthorized, logout the user
          this.$store.dispatch(AUTH_LOGOUT)
        // you can also redirect to /login if needed !
        }
        throw err
      })
    })
  }
}
</script>
