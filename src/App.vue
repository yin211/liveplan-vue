<template>
  <div id="app">
    <v-header></v-header>
    <div class="w-75 mx-auto">
      <router-view></router-view>
      <v-footer></v-footer>
    </div>
  </div>
</template>

<script>
import vheader from '@/components/header'
import vfooter from '@/components/footer'

export default {
  name: 'app',
  components: {
    'v-header': vheader,
    'v-footer': vfooter
  }
}
</script>

<style lang="scss">
  @import './style/index.scss';
  #app {
    font-family: Roboto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100vh;
    padding-top: 27px;
}

</style>
