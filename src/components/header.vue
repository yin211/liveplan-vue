<template>
  <div class="container-fluid vheader bg-dark">
    <b-navbar class="container" toggleable="xl" type="dark" variant="dark">

      <b-navbar-brand href="#" class="depth-1">
        <svg width="77px" height="18px" viewBox="0 0 77 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <!-- Generator: Sketch 50.2 (55047) - http://www.bohemiancoding.com/sketch -->
          <title>LOGO</title>
          <desc>Created with Sketch.</desc>
          <defs></defs>
          <g id="__Livesplan-UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Dashboard---Cashflow---Level-3" transform="translate(-323.000000, -53.000000)" fill="#2D2D2D">
                  <g id="Head" transform="translate(0.000000, -3.000000)">
                      <path d="M323.96,73 L323.96,56.2 L326.6,56.2 L326.6,70.6 L330.944,70.6 L330.944,73 L323.96,73 Z M333.296,73 L333.296,56.2 L335.936,56.2 L335.936,73 L333.296,73 Z M341.024,56.2 L343.04,69.904 L345.056,56.2 L347.48,56.2 L344.888,73 L340.952,73 L338.36,56.2 L341.024,56.2 Z M349.568,60.232 C349.568,57.544 350.888,56.008 353.456,56.008 C356.024,56.008 357.344,57.544 357.344,60.232 L357.344,60.76 L354.848,60.76 L354.848,60.064 C354.848,58.864 354.368,58.408 353.528,58.408 C352.688,58.408 352.208,58.864 352.208,60.064 C352.208,63.52 357.368,64.168 357.368,68.968 C357.368,71.656 356.024,73.192 353.432,73.192 C350.84,73.192 349.496,71.656 349.496,68.968 L349.496,67.936 L351.992,67.936 L351.992,69.136 C351.992,70.336 352.52,70.768 353.36,70.768 C354.2,70.768 354.728,70.336 354.728,69.136 C354.728,65.68 349.568,65.032 349.568,60.232 Z M363.968,56.2 C366.608,56.2 367.904,57.664 367.904,60.352 L367.904,62.536 C367.904,65.224 366.608,66.688 363.968,66.688 L362.72,66.688 L362.72,73 L360.08,73 L360.08,56.2 L363.968,56.2 Z M363.968,58.6 L362.72,58.6 L362.72,64.288 L363.968,64.288 C364.808,64.288 365.264,63.904 365.264,62.704 L365.264,60.184 C365.264,58.984 364.808,58.6 363.968,58.6 Z M370.448,73 L370.448,56.2 L373.088,56.2 L373.088,70.6 L377.432,70.6 L377.432,73 L370.448,73 Z M385.64,56.2 L388.328,73 L385.664,73 L385.208,69.952 L381.968,69.952 L381.512,73 L379.088,73 L381.776,56.2 L385.64,56.2 Z M383.576,59.176 L382.304,67.672 L384.848,67.672 L383.576,59.176 Z M396.392,73 L393.104,60.832 L393.104,73 L390.728,73 L390.728,56.2 L394.04,56.2 L396.752,66.256 L396.752,56.2 L399.104,56.2 L399.104,73 L396.392,73 Z" id="LOGO"></path>
                  </g>
              </g>
          </g>
        </svg>
      </b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" v-if="isAuthenticated"></b-navbar-toggle>

      <b-collapse is-nav id="nav_collapse" v-if="isAuthenticated">

        <b-navbar-nav class="left-nav">
          <b-nav-item to="/overview">{{ $t('header.header_menu.overview') }}</b-nav-item>
          <b-nav-item-dropdown :text="$t('header.header_menu.assumptions')" right v-bind:class="{ active: isAssumptionActive }">
            <b-dropdown-item href="#">INCOMES</b-dropdown-item>
            <b-dropdown-item to="/assumptions/expenses">EXPENSES</b-dropdown-item>
            <b-dropdown-item href="#">ASSETS</b-dropdown-item>
            <b-dropdown-item href="#">DEBTS</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item to="/timeline">{{ $t('header.header_menu.timeline') }}</b-nav-item>
          <b-nav-item to="/whatif">{{ $t('header.header_menu.whatif') }}</b-nav-item>
          <b-nav-item to="/tools-and-insights">{{ $t('header.header_menu.tools_and_insights') }}</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto right-nav">
          <b-dropdown id="ddown1" right size="sm" :text="selectedPlanText">
            <b-dropdown-item-button v-for="plan in plans" :key="plan.id" @click="selectPlan(plan)" class="d-flex align-items-center pl-3" v-bind:class="{active: selectedPlan && plan.id === selectedPlan.id}">
              <i class="flaticon stroke checkmark"></i>{{plan.description}}
            </b-dropdown-item-button>
          </b-dropdown>
          <div class="mx-4 spacing-divider"></div>
          <b-nav-item-dropdown right no-caret>
            <template slot="button-content">
              <div class="d-flex align-items-center">
                <i class="fa fa-user pr-2 text-secondary" style="font-size: 20px"></i> Jan Bolmeson <i class="fa fa-ellipsis-v ml-4" style="font-size: 24px;"></i>
              </div>
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
import EventBus from '../event-bus.js'

export default {
  name: 'vheader',
  data () {
    return {
      plans: [],
      selectedPlan: null,
      isAssumptionActive: this.$router.history.current.path.indexOf('/assumptions/') === 0
    }
  },
  async mounted () {
    try {
      let response = await axios.get(`${process.env.ROOT_API}/plans`)
      this.plans = response.data.data
      EventBus.$on('select-plan', async params => {
        response = this.plans.filter(plan => plan.id === params.plan_id)
        this.selectedPlan = response[0]
      })
    } catch (err) {
      console.log(err)
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    selectedPlanText () {
      if (this.selectedPlan) {
        return 'Plan : ' + this.selectedPlan.description
      } else {
        return 'Select Plan'
      }
    }
  },
  watch: {
    $route (to, from) {
      this.isAssumptionActive = this.$router.history.current.path.indexOf('/assumptions/') === 0
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
    @media (max-width: 576px) {
      height: 54px;
    }

    nav {
      height: 100%;
      max-width: 1400px;

      .navbar-brand {
        min-width: 170px;
        min-height: 126px;
        line-height: 126px;
        background-color: white;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 1.2px;
        color: #2d2d2d;
        padding: 0;
        @media (max-width: 576px) {
          min-width: 140px;
          min-height: 80px;
          line-height: 80px;
        }

        &:hover {
          color: #2d2d2d;
        }
      }

      .left-nav {
        .nav-item {
          font-size: 13px;
          font-weight: 500;
          color: #FFFFFF;
          letter-spacing: 0.5px;
          line-height: 24px;
          padding: 0px 16px !important;
          @media (min-width: 1200px) and (max-width: 1320px) {
            padding: 0px 6px !important;
          }


          [aria-expanded="true"].dropdown-toggle::after {
            border-top: 0 !important;
            border-bottom: .5em solid !important;
          }

          &.active {
            .nav-link {
              border-bottom: 4px solid #36B37E;
              opacity: 1;
            }
          }

          .nav-link {
            border-bottom: 4px solid transparent;
            opacity: 0.59;
            padding-bottom: 2px;

            &.active {
              border-bottom: 4px solid #36B37E;
              opacity: 1;
            }
            &.dropdown-toggle::after {
              margin-left: 0.5em;
              vertical-align: 0.1em;
              border-top: 0.5em solid;
              border-right: 0.5em solid transparent;
              border-bottom: 0;
              border-left: 0.5em solid transparent;
            }
          }

          .dropdown-menu {
            padding-top: 1rem;
            padding-bottom: 1rem;
            margin-top: 0.5rem;
            border-radius: 0;

            &:after {
              position: absolute;
              top: -8px;
              left: 20px;
              display: inline-block;
              border-right: 8px solid transparent;
              border-bottom: 8px solid white;
              border-left: 8px solid transparent;
              content: '';
            }

            .dropdown-item {
              font-size: 13px;
              font-weight: 500;
              outline: none;
              line-height: 32px;

              &.active {
                color: #36B37E;
                background-color: transparent;
              }
            }
          }
        }
      }

      .right-nav {
        .dropdown-toggle {
          padding: 8px 8px 8px 16px;
          line-height: 24px;
          background-color: #74778D;

          &::after {
            margin-left: 1em;
            margin-right: 0.5rem;
            vertical-align: 0.055em;
            font-size: 20px;
          }
        }

        .dropdown-menu {
          background-color: #74788D;

          .dropdown-item {
            color: white;
            opacity: 0.7;
            outline: none;
            font-size: 14px;
            background-color: transparent;

            &:hover, &:focus {
              opacity: 1;
              cursor: pointer;
            }

            &.active {
              opacity: 1;
              font-weight: bold;
              i {
                visibility: visible;
              }
            }

            i {
              font-size: 20px;
              padding-right: 0.25rem;
              visibility: hidden;
            }
          }
        }

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
