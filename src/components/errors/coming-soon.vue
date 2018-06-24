<template>
  <div class="comingSoon bg-light">
    <h1 class="display-3">Comming Soon</h1>
    <h2>
      Our website is currently undergoing scheduled maintance.<br>we should be back shortly. Thanks for your patience.
    </h2>
    <router-link :to="{name: 'login'}">Go to Login</router-link>
  </div>
</template>

<script>
export default {
  name: 'comingSoon'
}
</script>

<style lang="scss">
  .comingSoon {
    height: 100vh;
    padding-top: 70px;

    .display-3 {
      font-weight: 500;
    }
  }
</style>
