<template>
  <div class="vheader">
    <nav class="navbar navbar-expand-lg navbar-light">
      <a class="navbar-brand" href="#">
        <span class="logo">LIVSPLAN</span>
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div v-if="isAuthenticated" class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#">OVERVIEW</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">ASSUMPTION</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">TIMELINE</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">WHAT IF?</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">TOOLS / INSIGHTS</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'vheader',
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>

<style lang="scss" scoped>
  .vheader {
    height: 75px;
    nav {
      height: 75px;
      margin-left: 14vw;

      .navbar-brand {
        width: 170px;
        height: 134px;
        background-color: white;

        .logo{
          height: 29px;
          width: 89px;
          color: #2D2D2D;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 1.2px;
          line-height: 126px;
        }
      }

      .nav-link {
        opacity: 0.59;
        font-size: 13px;
        color: #FFFFFF;
        letter-spacing: 0.5px;
        line-height: 24px;
        padding: 0 24px;
      }
    }
  }
</style>
