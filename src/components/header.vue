<template>
  <div class="container-fluid vheader">
    <b-navbar class="container px-5" toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#" class="depth-1">
        <svg width="87px" height="18px" viewBox="0 0 87 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 50.2 (55047) - http://www.bohemiancoding.com/sketch -->
            <title>LOGO</title>
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="__Livesplan-UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Assumptions---Income-Detailed---v2" transform="translate(-315.000000, -52.000000)" fill="#2D2D2D">
                    <g id="Head" transform="translate(0.000000, -4.000000)">
                        <path d="M315.96,73 L315.96,56.2 L318.6,56.2 L318.6,70.6 L322.944,70.6 L322.944,73 L315.96,73 Z M325.296,73 L325.296,56.2 L327.936,56.2 L327.936,73 L325.296,73 Z M333.024,56.2 L335.04,69.904 L337.056,56.2 L339.48,56.2 L336.888,73 L332.952,73 L330.36,56.2 L333.024,56.2 Z M344.544,58.6 L344.544,63.28 L348.168,63.28 L348.168,65.68 L344.544,65.68 L344.544,70.6 L349.104,70.6 L349.104,73 L341.904,73 L341.904,56.2 L349.104,56.2 L349.104,58.6 L344.544,58.6 Z M351.6,60.232 C351.6,57.544 352.92,56.008 355.488,56.008 C358.056,56.008 359.376,57.544 359.376,60.232 L359.376,60.76 L356.88,60.76 L356.88,60.064 C356.88,58.864 356.4,58.408 355.56,58.408 C354.72,58.408 354.24,58.864 354.24,60.064 C354.24,63.52 359.4,64.168 359.4,68.968 C359.4,71.656 358.056,73.192 355.464,73.192 C352.872,73.192 351.528,71.656 351.528,68.968 L351.528,67.936 L354.024,67.936 L354.024,69.136 C354.024,70.336 354.552,70.768 355.392,70.768 C356.232,70.768 356.76,70.336 356.76,69.136 C356.76,65.68 351.6,65.032 351.6,60.232 Z M366,56.2 C368.64,56.2 369.936,57.664 369.936,60.352 L369.936,62.536 C369.936,65.224 368.64,66.688 366,66.688 L364.752,66.688 L364.752,73 L362.112,73 L362.112,56.2 L366,56.2 Z M366,58.6 L364.752,58.6 L364.752,64.288 L366,64.288 C366.84,64.288 367.296,63.904 367.296,62.704 L367.296,60.184 C367.296,58.984 366.84,58.6 366,58.6 Z M372.48,73 L372.48,56.2 L375.12,56.2 L375.12,70.6 L379.464,70.6 L379.464,73 L372.48,73 Z M387.672,56.2 L390.36,73 L387.696,73 L387.24,69.952 L384,69.952 L383.544,73 L381.12,73 L383.808,56.2 L387.672,56.2 Z M385.608,59.176 L384.336,67.672 L386.88,67.672 L385.608,59.176 Z M398.424,73 L395.136,60.832 L395.136,73 L392.76,73 L392.76,56.2 L396.072,56.2 L398.784,66.256 L398.784,56.2 L401.136,56.2 L401.136,73 L398.424,73 Z" id="LOGO"></path>
                    </g>
                </g>
            </g>
        </svg>
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse" v-if="isAuthenticated">

        <b-navbar-nav class="left-nav">
          <b-nav-item href="#">OVERVIEW</b-nav-item>
          <b-nav-item href="#">ASSUMPTIONS</b-nav-item>
          <b-nav-item href="#">TIMELINE</b-nav-item>
          <b-nav-item href="#">WHAT IF?</b-nav-item>
          <b-nav-item href="#">TOOLS / INSIGHTS</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto right-nav">
          <b-dropdown id="ddown1" right size="sm" :text="selectedPlanText">
            <b-dropdown-item-button v-for="plan in plans" :key="plan.id" @click="selectPlan(plan)">{{plan.description}}</b-dropdown-item-button>
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
import axios from 'axios'

export default {
  name: 'vheader',
  data () {
    return {
      plans: [],
      selectedPlan: null
    }
  },
  created () {
    axios.get('https://api.livsplan.se/api/v1/plans')
      .then(resp => (
        this.plans = resp.data.data
      ))
      .catch(error => console.log(error))
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    selectedPlanText () {
      if (this.selectedPlan) {
        return this.selectedPlan.description
      } else {
        return 'Select Plan'
      }
    }
  },
  methods: {
    logout () {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push('/login')
      })
    },
    selectPlan (plan) {
      this.selectedPlan = plan
    }

  }
}
</script>

<style lang="scss">
  .vheader {
    height: 75px;
    nav {
      height: 100%;
      max-width: 1400px;

      .navbar-brand {
        width: 170px;
        height: 126px;
        background-color: white;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 1.2px;
        line-height: 126px;
        color: #2d2d2d;
        padding: 0;

        &:hover {
          color: #2d2d2d;
        }
      }

      .left-nav {
        .nav-link {
          opacity: 0.59;
          font-size: 13px;
          font-weight: 500;
          color: #FFFFFF;
          letter-spacing: 0.5px;
          line-height: 24px;
          padding: 8px 1.5rem !important;
        }
      }

      .right-nav {
        .spacing-divider {
          opacity: .13;
          border: 1px solid #FFFFFF;
        }

        .nav-link {
          color: white;
          font-size: 14px;
        }
      }



    }
  }
</style>
