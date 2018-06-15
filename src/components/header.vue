<template>
  <div class="vheader">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#">LIVSPLAN</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse" v-if="isAuthenticated">

        <b-navbar-nav>
          <b-nav-item href="#">OVERVIEW</b-nav-item>
          <b-nav-item href="#">ASSUMPTION</b-nav-item>
          <b-nav-item href="#">TIMELINE</b-nav-item>
          <b-nav-item href="#">WHAT IF?</b-nav-item>
          <b-nav-item href="#">TOOLS / INSIGHTS</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto mr-4">
          <b-dropdown id="ddown1" right size="sm" text="Plan: Until we are 80">
          </b-dropdown>
          <div class="mx-4 spacing-divider"></div>
          <b-nav-item-dropdown right no-caret>
            <template slot="button-content">
              <i class="fa fa-user pr-2"></i> Jan Bolmeson <i class="fa fa-ellipsis-v ml-4"></i>
            </template>
            <b-dropdown-item @click="logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import {AUTH_LOGOUT} from '@/store/actions/auth'

export default {
  name: 'vheader',
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    logout () {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .vheader {
    height: 75px;
    nav {
      height: 100%;
      margin-left: 14vw;

      .navbar-brand {
        width: 170px;
        height: 134px;
        background-color: white;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 1.2px;
        line-height: 126px;
        color: #2d2d2d;
      }

      .nav-link {
        opacity: 0.59;
        font-size: 13px;
        color: #FFFFFF;
        letter-spacing: 0.5px;
        line-height: 24px;
        padding: 0 24px;
      }

      .spacing-divider {
        opacity: .13;
        border: 1px solid #FFFFFF;
      }
    }
  }
</style>
