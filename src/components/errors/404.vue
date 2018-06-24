<template>
  <div class="notFound bg-light">
    <h1 class="display-1">404</h1>
    <h2>Sorry but we couldn't find the page you are looking for</h2>
    <router-link :to="{name: 'login'}">Go to Login</router-link>
  </div>
</template>

<script>
export default {
  name: 'notFound'
}
</script>

<style lang="scss">
  .notFound {
    height: 100vh;
    padding-top: 70px;

    .display-1 {
      font-weight: 500;
    }
  }
</style>
