<template>
  <div class="container-fluid vheader bg-dark">
    <header>
      <nav role="navigation" class="d-flex align-items-center mx-auto">
        <div href="#" class="depth-1 livsplan-navbar-brand">
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

        <a href="javascript:void(0);" class="ic menu" v-if="isAuthenticated">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </a>
        <a href="javascript:void(0);" class="ic close" v-if="isAuthenticated"></a>
        <ul class="main-nav my-auto" v-if="isAuthenticated">
          <li>
            <a href="/overview"><span>OVERVIEW</span></a>
          </li>
          <b-nav-item-dropdown :text="$t('header.header_menu.assumptions')" right v-bind:class="{ active: isAssumptionActive }">
            <b-dropdown-item href="#">INCOMES</b-dropdown-item>
            <b-dropdown-item to="/assumptions/expenses">EXPENSES</b-dropdown-item>
            <b-dropdown-item href="#">ASSETS</b-dropdown-item>
            <b-dropdown-item href="#">DEBTS</b-dropdown-item>
          </b-nav-item-dropdown>
          <li>
            <a href="/timeline"><span>TIMELINE</span></a>
          </li>
          <li>
            <a href="/whatif"><span>WHAT IF?</span></a>
          </li>
          <li>
            <a href="/tools-and-insights"><span>TOOLS / INSIGHTS</span></a>
          </li>

          <!-- <li>
            <a class="mega-menu"><span>Products</span></a>
            <div class="sub-menu-block">
              <div class="row">
                <div class="col-md-4 col-lg-4 col-sm-4">
                  <h2 class="sub-menu-head">Clothing</h2>
                  <ul class="sub-menu-lists">
                    <li><a>Kids</a></li>
                    <li><a>New Born</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </li> -->
          <li class="ml-auto">
            <b-dropdown id="ddown1" right size="sm" :text="selectedPlanText">
              <b-dropdown-item-button v-for="plan in plans" :key="plan.id" @click="selectPlan(plan)" class="d-flex align-items-center pl-3" v-bind:class="{active: selectedPlan && plan.id === selectedPlan.id}">
                <i class="flaticon stroke checkmark"></i>{{plan.description}}
              </b-dropdown-item-button>
            </b-dropdown>
          </li>
          <li class="p-0">
            <b-nav-item-dropdown right no-caret>
              <template slot="button-content">
                <div class="d-flex align-items-center">
                  <i class="fa fa-user pr-2 text-secondary" style="font-size: 20px"></i> <span>Jan Bolmeson</span> <i class="fa fa-ellipsis-v ml-4" style="font-size: 24px;"></i>
                </div>
              </template>
              <b-dropdown-item @click="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </li>
        </ul>
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
    nav {
      position: relative;
      height: 75px;

      @media (max-width: 575.98px) {
        height: 54px;
      }
      max-width: 1400px;
      padding: .5rem 1rem;

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
        @media (max-width: 576px) {
          min-width: 140px;
          height: 80px;
          line-height: 80px;
        }
      }

      .b-nav-dropdown {
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

      .b-dropdown {
        .dropdown-toggle {
          padding: 8px 8px 8px 16px;
          line-height: 24px;
          background-color: #74778d;

          &:after {
            margin-left: .5em;
            margin-right: .5rem;
            vertical-align: .055em;
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
      }

      .nav-link {
        color: white;
        font-size: 14px;
        line-height: 20px;
      }
    }

    ul.main-nav {
      list-style-type: none;
      padding: 0px;
      font-size: 0px;
      flex: 1;
    }

    ul.main-nav > li {
      display: inline-block;
      padding: 0 16px;
    }

    ul.main-nav > li > a {
      color: #ACAEBA;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.5px;
      line-height: 24px;
    }

    ul.main-nav > li:hover > a {
      color: white;
      cursor: pointer;
      text-decoration: none;
    }

    ul.main-nav > li ul.sub-menu-lists {
      margin: 0px;
      padding: 0px;
      list-style-type : none;
      display:block;
    }

    ul.main-nav > li ul.sub-menu-lists > li {
      padding: 2px 0;
    }

    ul.main-nav > li ul.sub-menu-lists > li > a {
      font-size: 14px;
    }

    .ic {
      position: fixed;
      cursor: pointer;
      display: inline-block;
      right: 25px;
      width: 32px;
      height: 24px;
      text-align: center;
      top:0px;
      outline: none;
    }

    .ic.close {
      opacity: 0;
      font-size: 0px;
      font-weight: 300;
      color: #fff;
      top:8px;
      height:40px;
      display: block;
      outline: none;
    }

    /* Menu Icons for Devices*/
    .ic.menu { top:25px; z-index : 20; }

    .ic.menu .line {
      height: 4px;
      width: 100%;
      display: block;
      margin-bottom: 6px;
    }
    .ic.menu .line-last-child { margin-bottom: 0px;  }

    .sub-menu-head { margin: 10px 0; }
    .banners-area { margin-top: 20px; padding-top: 15px; }


    @media only screen and (max-width:768px) {
      .sub-menu-head { color:orange; }
      .ic.menu { display: block; }
      header .ic.menu .line { background-color: #fff; }
      .ic.menu .line {
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
      .ic.menu:focus .line { background-color: #fff !important; }

      .ic.menu:focus .line:nth-child(1) {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
      }

      .ic.menu:focus .line:nth-child(2) {
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
        margin-top: -10px;
      }

      .ic.menu:focus .line:nth-child(3) {
        transform: translateY(15px);
        opacity: 0;
      }

      .ic.menu:focus{ outline: none; }
      .ic.menu:focus ~ .ic.close { opacity: 1; z-index : 21;  outline: none;  }

      /*

      .ic.menu:focus ~ .ic.close { opacity: 1.0; z-index : 21;  }
      .ic.close:focus { opacity: 0; }
      */
      .ic.menu:hover,
      .ic.menu:focus { opacity: 1; }


      nav { background-color: transparent; }

    /* Main Menu for Handheld Devices  */
      ul.main-nav {
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

      .ic.menu:focus ~ .main-nav { width: 100vw; background-color:#535671; }

      ul.main-nav > * {
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
      .ic.menu:focus ~ .main-nav > * {opacity: 1;}

      // ul.main-nav > li > a:after {display: none;}
      ul.main-nav > li:first-child { border-radius: 0px; }
      ul.main-nav > li {
        display: block;
        // border-bottom: 1px solid #444;
      }

      ul.main-nav > li > a { font-weight: 600; }

      ul.main-nav > li ul.sub-menu-lists > li a { color: #eee; font-size: 14px; }
      .sub-menu-head { font-size: 16px;}
      ul.main-nav > li:hover { background-color: transparent;  }
      ul.main-nav > li:hover > a {color: #fff; text-decoration: none; font-weight: 600;}
    .ic.menu:focus ~ ul.main-nav > li > div.sub-menu-block {
        border-left: 0px solid #ccc;
        border-right: 0px solid #ccc;
        border-bottom: 0px solid #ccc;
        position: relative;
        visibility: visible;
        opacity: 1.0;
      }

      .sub-menu-block { padding: 0 30px; }
      .banners-area { padding-bottom: 0px;  }
      .banners-area div { margin-bottom: 15px;  }
      .banners-area { border-top: 1px solid #444; }
    }

    @media only screen and (min-width:769px) {
      .ic.menu { display: none; }
      /* Main Menu for Desktop Devices  */
      ul.main-nav {
        display: flex;
        position: relative;
        align-items: center
      }
      .sub-menu-block { padding: 15px; }

      /* Sub Menu */
      ul.main-nav > li > div.sub-menu-block {
      visibility: hidden;
      background-color: #f9f9f9;
      position: absolute;
      margin-top: 0px;
      width: 100%;
      color: #333;
      left: 0;
      box-sizing: border-box;
      z-index : 3;
      font-size: 16px;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      opacity: 0;

      /*CSS animation applied for sub menu : Slide from Top */
      -webkit-transition: all 0.4s ease 0s;
      -o-transition: all 0.4s ease 0s;
      transition: all 0.4s ease 0s;
      -webkit-transform: rotateX(90deg);
      -moz-transform: rotateX(90deg);
      -ms-transform: rotateX(90deg);
      transform: rotateX(90deg);
      -webkit-transform-origin: top center;
      -ms-transform-origin: top center;
      transform-origin: top center;

      }

      ul.main-nav > li:hover > div.sub-menu-block{
        background-color: #f9f9f9;
        visibility: visible;
        opacity: 1;
        -webkit-transform: rotateX(0deg);
        -moz-transform: rotateX(0deg);
        -ms-transform: rotateX(0deg);
        transform: rotateX(0deg);
      }

      ul.main-nav > li > div.sub-menu-block > * {
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

      ul.main-nav > li:hover > div.sub-menu-block > * {
        opacity: 1;
      }

      .sub-menu-head { font-size: 20px;}

      // /* List Separator: Inner Border */
      // ul.main-nav > li > a:after {
      //   content: '';
      //   width: 1px;
      //   height: 62px;
      //   position: absolute;
      //   right:0px;
      //   top: 0px;
      //   z-index : 2;
      // }
      // header ul.main-nav > li > a:after { background-color: #777; }
      // header.light ul.main-nav > li > a:after { background-color: #999; }

      /* Drop Down/Up Arrow for Mega Menu */
      ul.main-nav > li > a.mega-menu > span { display: block; vertical-align: middle; }
      ul.main-nav > li > a.mega-menu > span:after {
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #fff;
        content: '';
        background-color: transparent;
        display: inline-block;
        margin-left: 10px;
        vertical-align: middle;
      }

      ul.main-nav > li:hover > a.mega-menu span:after{
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 0px solid transparent;
        border-bottom: 5px solid #666;
      }
      .banners-area { border-top: 1px solid #ccc; }
    }
  }
</style>
