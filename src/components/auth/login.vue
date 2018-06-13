<template>
  <div class="login d-flex justify-content-between flex-column">
    <div class="main d-flex justify-content-center secondary-bg-color">
        <ul class="d-flex flex-column justify-content-end align-items-end mb-5">
          <li class="elem-active">LOGIN WITH EMAIL</li>
          <li>LOGIN WITH MOBILE BANKID</li>
          <li>SIGNUP FOR LIVSPLAN</li>
        </ul>
        <b-form @submit="onSubmit" novalidate class="bg-white depth-2 text-left" :validated="validated">
          <b-form-group id="emailInputGroup" label="Email" label-for="emailInput" class="mb-4" :invalid-feedback="invalidEmailFeedback" :state="emailState">
            <b-form-input id="emailInput" type="email" v-model="form.email" required placeholder="Type here">
            </b-form-input>
          </b-form-group>
          <b-form-group id="passwordInputGroup" label="Password" label-for="passwordInput" class="mb-4" :invalid-feedback="invalidPwdFeedback" :state="pwdState">
            <b-form-input id="passwordInput" type="password" v-model="form.password" required placeholder="Type here">
            </b-form-input>
          </b-form-group>

          <b-form-group id="rememberGroup" class="mt-2 mb-4">
            <b-form-checkbox-group v-model="form.checked" id="rememberCheck">
              <b-form-checkbox value="me" class="text-gray">Remember me in the next 30 days</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-button type="submit" variant="primary" class="w-100">Login</b-button>
        </b-form>
    </div>
    <div class="bottom mb-4">
      <ul class="d-flex justify-content-center">
        <li class="mx-2 text-gray">About Us</li>
        <li class="mx-2 text-gray">Terms of Service</li>
        <li class="mx-2 text-gray">Privacy Policy</li>
        <li class="mx-2 text-gray">Get in Touch</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {AUTH_REQUEST} from '@/store/actions/auth'
export default {
  name: 'login',
  mounted () {
    if (this.$store.getters.isAuthenticated) {
      this.$router.push('/expense')
    }
  },
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      validated: false
    }
  },
  computed: {
    invalidPwdFeedback () {
      if (this.form.password.length > 4) {
        return ''
      } else if (this.form.password.length > 0) {
        return 'Enter at least 4 characters'
      } else {
        return 'Please enter password'
      }
    },
    pwdState () {
      return !this.validated || this.form.password.length >= 4
    },

    invalidEmailFeedback () {
      if (this.form.email.length < 1) {
        return 'Please enter an email'
      } else if (!this.validEmail(this.form.email)) {
        return 'Please enter valid email'
      } else {
        return ''
      }
    },
    emailState () {
      return !this.validated || this.validEmail(this.form.email)
    }

  },
  methods: {
    /* eslint-disable */
    validEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    /* eslint-enable */
    onSubmit (evt) {
      evt.preventDefault()
      this.validated = true
      if (this.validEmail(this.form.email) && this.form.password.length >= 4) {
        const { email, password } = this.form
        this.$store.dispatch(AUTH_REQUEST, { email, password }).then(() => {
          this.$router.push('/expense')
        }, () => {
          this.$notify({
            group: 'notify',
            type: 'error',
            title: 'Error',
            duration: 3000,
            text: 'Authentication Failed!'
          })
        })
      } else {
        return
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .login {
    height: calc(100vh - 102px);
    min-height: 800px;
    overflow: auto;

    .main {
      height: 446px;

      form {
        width: 381px;
        height: 434px;
        padding: 58px 30px 65px;
        margin-top: 146px;

        input {
          height: 46px;
        }

        button[type="submit"] {
          font-weight: 600;
          height: 3rem;
        }
      }

      ul {
        list-style: none;
        margin-right: 114px;

        li {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
          line-height: 24px;
          margin: 24px 0;
          opacity: 0.59;
          color: #383838;
          display: table;
          cursor: pointer;
        }
      }
    }

    .bottom {
      ul {
        list-style: none;
        font-size: 14px;
        line-height: 20px;
        li {
          cursor: pointer;
        }
      }
    }
  }
</style>
