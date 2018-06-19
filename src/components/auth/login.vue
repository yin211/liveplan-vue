<template>
  <div class="login d-flex justify-content-between flex-column">
    <div class="main d-flex justify-content-center bg-light">
        <ul class="d-flex flex-column justify-content-end align-items-end mb-5">
          <li @click="loginWithEmail" :class="{'elem-active': isLoginWithEmail}">{{ $t('LOGIN WITH EMAIL') }}</li>
          <li @click="loginWithBankID" :class="{'elem-active': isLoginWithBankID}">{{ $t('LOGIN WITH MOBILE BANKID') }}</li>
          <li @click="signup" :class="{'elem-active': isSignup}">{{ $t('SIGNUP FOR LIVSPLAN') }}</li>
        </ul>

        <!-- LOGIN FORM -->
        <b-form @submit="onSubmitByEmail" novalidate class="bg-white depth-2 text-left" :validated="validated" v-if="isLoginWithEmail" style="height: 434px">
          <b-form-group class="emailInputGroup mb-4" v-bind:label="$t('Email')" label-for="emailInput" :invalid-feedback="$t(invalidEmailFeedback)" :state="emailState">
            <b-form-input class="emailInput" type="email" v-model="form.login.email" required v-bind:placeholder="$t('luke@skywalker.com')">
            </b-form-input>
          </b-form-group>
          <b-form-group class="passwordInputGroup mb-4" v-bind:label="$t('Password')" label-for="passwordInput" :invalid-feedback="$t(invalidPwdFeedback)" :state="pwdState">
            <b-form-input class="passwordInput" type="password" v-model="form.login.password" required v-bind:placeholder="$t('May the force *********')">
            </b-form-input>
          </b-form-group>

          <b-form-group class="rememberGroup mt-2 mb-4">
            <b-form-checkbox-group v-model="form.checked" class="rememberCheck">
              <b-form-checkbox value="me" class="text-gray">{{ $t('Remember me in the next 30 days') }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-button type="submit" variant="primary" class="w-100 text-capitalize">{{ $t('login') }}</b-button>
        </b-form>


        <!-- BANK-ID FORM -->
        <b-form @submit="onSubmitByID" novalidate class="bg-white depth-2 text-left " :validated="validated" v-if="isLoginWithBankID" style="height: 337px">
          <b-form-group class="idInputGroup mb-4" v-bind:label="$t('Social Security Number')" label-for="idInput" :invalid-feedback="$t(invalidIDFeedback)" :state="idState">
            <b-form-input class="idInput" type="text" v-model="form.login.id" required v-bind:placeholder="$t('Type here')">
            </b-form-input>
          </b-form-group>

          <b-form-group class="rememberGroup mt-2 mb-4">
            <b-form-checkbox-group v-model="form.checked" class="rememberCheck">
              <b-form-checkbox value="me" class="text-gray">{{ $t('Remember me in the next 30 days') }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-button type="submit" variant="primary" class="w-100 text-capitalize">{{ $t("login") }}</b-button>
        </b-form>


        <!-- SIGNUP FORM -->
        <b-form @submit="onSignup" novalidate class="bg-white depth-2 text-left" :validated="validated" v-if="isSignup" style="height: 490px">
          <b-form-group class="userNameInputGroup mb-4" v-bind:label="$t('First- and lastname')" label-for="userNameInput" :invalid-feedback="$t(invalidUserNameFeedback)" :state="userNameState">
            <b-form-input class="userNameInput" type="text" v-model="form.signup.username" required v-bind:placeholder="$t('Luke Skywalker')">
            </b-form-input>
          </b-form-group>
          <b-form-group class="emailInputGroup mb-4" v-bind:label="$t('Email')" label-for="emailInput" :invalid-feedback="$t(invalidEmailFeedback)" :state="emailState">
            <b-form-input class="emailInput" type="email" v-model="form.signup.email" required v-bind:placeholder="$t('luke@skywalker.com')">
            </b-form-input>
          </b-form-group>
          <b-form-group class="passwordInputGroup mb-4" v-bind:label="$t('Password')" label-for="passwordInput" :invalid-feedback="$t(invalidPwdFeedback)" :state="pwdState">
            <b-form-input class="passwordInput" type="password" v-model="form.signup.password" required v-bind:placeholder="$t('The password is strong with this one...')">
            </b-form-input>
          </b-form-group>
          <b-form-group class="tocGroup mt-2 mb-4">
            <b-form-checkbox-group v-model="form.checked" class="tocCheckbox">
              <b-form-checkbox value="me" class="text-gray">{{ $t('Accept terms & conditions') }}</b-form-checkbox>
            </b-form-checkbox-group>
            <b-form-checkbox-group v-model="form.checked" class="newsletterCheckbox">
              <b-form-checkbox value="me" class="text-gray">{{ $t('It\'s ok to send me newsletters') }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>

          <b-button type="submit" variant="primary" class="w-100">{{ $t('Signup') }}</b-button>
        </b-form>


    </div>
    <div class="bottom mb-4">
      <ul class="d-flex justify-content-center">
        <li class="mx-2 text-gray">{{ $t('About Us') }}</li>
        <li class="mx-2 text-gray">{{ $t('Terms of Service') }}</li>
        <li class="mx-2 text-gray">{{ $t('Privacy Policy') }}</li>
        <li class="mx-2 text-gray">{{ $t('Get in Touch') }}</li>
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
        login: {
          email: '',
          password: '',
          id: ''
        },
        signup: {
          username: '',
          email: '',
          password: ''
        }
      },
      validated: false,
      isLoginWithEmail: true,
      isLoginWithBankID: false,
      isSignup: false
    }
  },
  computed: {
    invalidPwdFeedback () {
      let pwd = this.isLoginWithEmail ? this.form.login.password : this.form.signup.password
      if (pwd.length > 4) {
        return ''
      } else if (pwd.length > 0) {
        return 'Enter at least 4 characters'
      } else {
        return 'Please enter password'
      }
    },
    pwdState () {
      let pwd = this.isLoginWithEmail ? this.form.login.password : this.form.signup.password
      return !this.validated || pwd.length >= 4
    },

    invalidEmailFeedback () {
      let email = this.isLoginWithEmail ? this.form.login.email : this.form.signup.email
      if (email.length < 1) {
        return 'Please enter an email'
      } else if (!this.validEmail(email)) {
        return 'Please enter valid email'
      } else {
        return ''
      }
    },
    emailState () {
      let email = this.isLoginWithEmail ? this.form.login.email : this.form.signup.email
      return !this.validated || this.validEmail(email)
    },

    invalidIDFeedback () {
      if (this.form.login.id.length > 0) {
        return ''
      } else {
        return 'Please enter a Swedish social security number'
      }
    },
    idState () {
      return !this.validated || this.form.login.id.length > 0
    },

    invalidUserNameFeedback () {
      if (this.form.signup.username.length > 0) {
        return ''
      } else {
        return 'Please enter your first and lastname'
      }
    },
    userNameState () {
      return !this.validated || this.form.signup.username.length > 0
    }

  },
  methods: {
    format () {
      this.isLoginWithEmail = false
      this.isLoginWithBankID = false
      this.isSignup = false
      this.validated = false
    },
    loginWithEmail () {
      this.format()
      this.isLoginWithEmail = true
    },
    loginWithBankID () {
      this.format()
      this.isLoginWithBankID = true
    },
    signup () {
      this.format()
      this.isSignup = true
    },
    /* eslint-disable */
    validEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    /* eslint-enable */
    onSubmitByEmail (evt) {
      evt.preventDefault()
      this.validated = true
      if (this.validEmail(this.form.login.email) && this.form.login.password.length >= 4) {
        const { email, password } = this.form.login
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
      }
    },

    onSubmitByID (evt) {
      evt.preventDefault()
      this.validated = true
    },

    onSignup (evt) {
      evt.preventDefault()
      this.validated = true
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
        padding: 58px 30px 65px;
        margin-top: 146px;
        font-size: 14px;

        input {
          height: 46px;
          font-size: 14px;
        }

        button[type="submit"] {
          font-weight: 600;
          height: 3rem;
          font-size: 14px;
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

          &:after {
            border-bottom: 4px solid #36B37E;
            padding-left: 15px;
            display:block;
            content: '';
            transform: scaleX(0);
            transition: transform 250ms ease-in-out;
          }
          &[class="elem-active"] {
            opacity: 1;
          }
          &[class="elem-active"]:after {
            transform: scaleX(1);
          }
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
