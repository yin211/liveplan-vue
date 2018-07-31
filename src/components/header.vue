<template>
  <div class="container-fluid vheader bg-dark">
    <header>
      <nav role="navigation" class="d-flex align-items-center mx-auto">
        <div href="#" class="depth-3 livsplan-navbar-brand">
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
        </div>

        <a href="javascript:void(0);" class="collapse-menu" v-bind:class="{ 'is-expand': isNavExpanded }" v-if="isAuthenticated" @click="toggle_nav()">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </a>
        <div class="active-link" v-if="isAuthenticated">
          ASSUMPTIONS
        </div>
        <ul class="main-nav my-auto" v-bind:class="{ 'is-expand': isNavExpanded }" v-if="isAuthenticated">
          <li>
            <a href="/overview"><span>OVERVIEW</span></a>
          </li>
          <b-nav-item-dropdown :text="$t('header.header_menu.assumptions')" right v-bind:class="{ active: isAssumptionActive }" class="left-link">
            <b-dropdown-item href="#">INCOMES</b-dropdown-item>
            <b-dropdown-item to="/assumptions/expenses">EXPENSES</b-dropdown-item>
            <b-dropdown-item href="#">ASSETS</b-dropdown-item>
            <b-dropdown-item href="#">DEBTS</b-dropdown-item>
          </b-nav-item-dropdown>
          <li class="sub-left-link">
            <a href="#"><span>ASSUMPTIONS</span></a>
            <ul>
              <li><a href="#">Incomes</a></li>
              <li><a href="/assumptions/expenses">Expenses</a></li>
              <li><a href="#">Assets</a></li>
              <li><a href="#">Debts</a></li>
            </ul>
          </li>
          <li>
            <a href="/timeline"><span>TIMELINE</span></a>
          </li>
          <li>
            <a href="/whatif"><span>WHAT IF?</span></a>
          </li>
          <li class="tools-insights-link">
            <a href="/tools-and-insights"><span>TOOLS / INSIGHTS</span></a>
          </li>

          <li class="ml-auto plan-selector right-link">
            <b-dropdown id="ddown1" right size="sm" :text="selectedPlanText">
              <b-dropdown-item-button v-for="plan in plans" :key="plan.id" @click="selectPlan(plan)" class="d-flex align-items-center pl-2 py-0" v-bind:class="{active: selectedPlan && plan.id === selectedPlan.id}">
                <i class="flaticon stroke checkmark"></i>{{plan.description}}
              </b-dropdown-item-button>
            </b-dropdown>
          </li>
          <li class="p-0 right-link logout-dropdown">
            <b-nav-item-dropdown right no-caret>
              <template slot="button-content">
                <div class="d-flex align-items-center">
                  <i class="fa fa-user pr-2 text-secondary" style="font-size: 20px"></i> <span>Jan Bolmeson</span> <i class="fa fa-ellipsis-v ml-4" style="font-size: 24px;"></i>
                </div>
              </template>
              <b-dropdown-item @click="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </li>
          <li class="sub-right-link profile-settings-link">
            <a href="#"><span>Profile Settings</span></a>
          </li>
          <li class="sub-right-link">
            <a href="#"><span>Plan & Subscription</span></a>
          </li>
          <li class="sub-right-link">
            <a @click="logout"><span>Log Out</span></a>
          </li>
        </ul>
        <b-dropdown id="ddown2" class="plan-tablet ml-auto" right size="sm" :text="selectedPlanText" v-if="isAuthenticated">
          <b-dropdown-item-button v-for="plan in plans" :key="plan.id" @click="selectPlan(plan)" class="d-flex align-items-center pl-2 py-0" v-bind:class="{active: selectedPlan && plan.id === selectedPlan.id}">
            <i class="flaticon stroke checkmark"></i>{{plan.description}}
          </b-dropdown-item-button>
        </b-dropdown>
      </nav>
    </header>
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
      isAssumptionActive: this.$router.history.current.path.indexOf('/assumptions/') === 0,
      isNavExpanded: false
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
    },
    toggle_nav () {
      this.isNavExpanded = !this.isNavExpanded
    }

  }
}
</script>

<style lang="scss">
  .vheader {
    nav {
      position: relative;
      height: 75px;
      max-width: 1400px;
      padding: .5rem 1rem;

      @media (max-width: 575.98px) {
        height: 54px;

        .collapse-menu {
          top: 18px;
          position: absolute;
          right: 25px;
        }
      }


      .livsplan-navbar-brand {
        min-width: 170px;
        height: 126px;
        line-height: 126px;
        background-color: white;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 1.2px;
        color: #2d2d2d;
        padding: 0;
        flex: 0;
        margin-right: 34px;
        @media (max-width: 1199.98px) {
          margin-right: 20px;
        }

        @media (max-width: 576px) {
          min-width: 140px;
          height: 80px;
          line-height: 80px;
        }
      }

      .left-link.b-nav-dropdown {
          [aria-expanded="true"].nav-link::after {
            border-top: 0 !important;
            border-bottom: .5em solid !important;
          }

          &.active .nav-link {
            border-bottom: 4px solid #36b37e;
            padding-bottom: 3px;
            color: white;

            &::after {
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

      .plan-tablet,
      .right-link {
        .dropdown-toggle {
          padding: 8px 8px 8px 16px;
          line-height: 24px;
          background-color: #74778d;
          border-radius: 0;

          &:after {
            margin-left: 1em;
            margin-right: .5rem;
            vertical-align: .055em;
            font-size: 20px;
          }
        }

        .dropdown-menu {
          background-color: #74788D;
          margin-top: 0;
          border: 0;
          border-radius: 0;
          width: 100%;

          .dropdown-item {
            color: white;
            opacity: 0.7;
            outline: none;
            font-size: 14px;
            line-height: 24px;
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
              padding: 0.5rem 0.25rem 0.25rem;
              visibility: hidden;
            }
          }
        }
      }

      .nav-link {
        color: white;
        font-size: 14px;
        line-height: 20px;
      }

      .plan-tablet {
        display: none;
      }

      .active-link {
        display: none;
      }
    }

    .main-nav {
      list-style-type: none;
      padding: 0px;
      flex: 1;
    }

    .main-nav > li {
      padding: 0 16px;
    }

    .main-nav > li > a {
      color: #ACAEBA;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.5px;
      line-height: 24px;
    }

    .main-nav > li:hover > a {
      color: white;
      cursor: pointer;
      text-decoration: none;
    }

    .collapse-menu {
      cursor: pointer;
      width: 30px;
      height: 18px;
      text-align: center;
      top: 0px;
      outline: none;
      z-index : 20;
    }

    .collapse-menu .line {
      height: 2px;
      width: 100%;
      display: block;
      margin-bottom: 6px;
    }

    @media only screen and (max-width:1199.98px) {
      .collapse-menu { display: block; }
      .collapse-menu .line {
        background-color: #fff;
        -webkit-transition: all 0.4s ease 0s;
        -o-transition: all 0.4s ease 0s;
        transition: all 0.4s ease 0s;
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
        -webkit-transform-origin: center center;
        -ms-transform-origin: center center;
        transform-origin: center center;
      }

      @media (min-width: 576px) {
        .collapse-menu.is-expand {
          position: fixed;
          left: 38px;
          top: 50px;
        }
        .plan-tablet {
          display: block !important;
        }

        .active-link {
          display: block !important;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
          line-height: 24px;
          margin-left: 20px;
        }
      }

      @media (max-width: 575.98px) {
        .collapse-menu.is-expand {
          position: fixed;
          right: 30px;
          top: 30px
        }
      }

      .collapse-menu.is-expand .line:nth-child(1) {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
      }

      .collapse-menu.is-expand .line:nth-child(2) {
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
        margin-top: -8px;
      }

      .collapse-menu.is-expand .line:nth-child(3) {
        transform: translateY(15px);
        opacity: 0;
      }

      .collapse-menu:focus{ outline: none; }

      nav { background-color: transparent; }

      /* Main Menu for Handheld Devices  */
      .main-nav {
        z-index:2;
        padding: 50px 0;
        position: fixed;
        right: 0px;
        top: 0px;
        width: 0px;
        background-color:#535671;
        height: 100%;
        overflow: auto;
        /*CSS animation applied : Slide from Right*/
        -webkit-transition-property: background, width;
        -moz-transition-property: background, width;
        -o-transition-property: background, width;
        transition-property: background, width;
        -webkit-transition-duration: 0.6s;
          -moz-transition-duration: 0.6s;
          -o-transition-duration: 0.6s;
        transition-duration: 0.6s;
      }

      .main-nav.is-expand {
        width: 100vw;
        text-align: left;
        @media (min-width: 576px) {
          padding: 200px 100px 100px;

          .plan-selector {
            display: none;
          }
        }

        @media (max-width: 575.98px) {
          padding: 116px 24px 24px;

          .plan-selector {
            position: absolute;
            top: 12px;
            display: block !important;
          }
        }
        & > * {
          opacity: 1;
        }
      }

      .main-nav > * {
        -webkit-transition-property: opacity;
        -moz-transition-property: opacity;
        -o-transition-property: opacity;
        transition-property: opacity;
        -webkit-transition-duration: 0.4s;
          -moz-transition-duration: 0.4s;
          -o-transition-duration: 0.4s;
        transition-duration: 0.4s;
        opacity: 0;
      }

      .main-nav > li:first-child { border-radius: 0px; }
      .main-nav > li {
        display: block;
        margin-bottom: 38px;
        padding: 0;
        a {
          font-size: 24px;
          line-height: 32px;
          color: white;
          font-weight: 400;
          letter-spacing: 0
        }
        @media (max-width: 575.98px) {
          margin-bottom: 18px;

          a {
            font-size: 20px;
          }
        }
      }

      .tools-insights-link {
        margin-bottom: 52px !important;

        @media (min-width: 576px) {
          margin-bottom: 152px !important;
        }
      }

      .left-link {
        display: none !important;
      }
      .right-link {
        display: none !important;
      }

      .sub-left-link {
        & > a {
          opacity: .39;
          font-weight: 500;
        }
        ul {
          display: flex;
          list-style-type: none;
          padding-left: 20px;
          padding-top: 8px;
          li {
            margin-right: 14px;
          }
          @media (max-width: 575.98px) {
            display: block;
          }
        }
      }

      .sub-right-link {
        a {
          font-size: 18px !important;
        }

        &.profile-settings-link {
          padding-top: 44px;
          border-top: 1px dashed #979797;
        }

        @media (min-width: 576px) {
          margin-bottom: 8px !important;
        }
      }
    }

    @media only screen and (min-width:1200px) {
      .collapse-menu { display: none; }
      /* Main Menu for Desktop Devices  */
      .main-nav {
        display: flex;
        position: relative;
        align-items: center
      }

      .sub-left-link {
        display: none !important;
      }

      .sub-right-link {
        display: none !important;
      }

      .plan-selector {
        padding-right: 28px !important;
        border-right: 1px solid rgba(255, 255, 255, .13);
      }

      .logout-dropdown {
        margin-left: 12px;
      }

    }
  }
</style>
