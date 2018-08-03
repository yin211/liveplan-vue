<template>
  <div class="login d-flex justify-content-between flex-column mx-auto">
    <div class="main d-flex flex-column flex-md-row justify-content-md-center bg-light">
        <ul class="d-md-flex flex-md-column justify-content-md-end align-items-md-end mb-md-5">
          <li @click="loginWithEmail" :class="{'elem-active': isLoginWithEmail}">{{ $t('login.label.login_with_email') }}</li>
          <li @click="loginWithBankID" :class="{'elem-active': isLoginWithBankID}">{{ $t('login.label.login_width_mobile_bankid') }}</li>
          <li @click="signup" :class="{'elem-active': isSignup}">{{ $t('login.label.signup_for_livsplan') }}</li>
        </ul>

        <!-- LOGIN FORM -->
        <b-form @submit="onSubmitByEmail" novalidate class="bg-white depth-2 text-left" :validated="validated" v-if="isLoginWithEmail" style="height: 414px">
          <b-form-group class="emailInputGroup mb-4" v-bind:label="$t('login.label.email')" label-for="emailInput" :invalid-feedback="$t(invalidEmailFeedback)" :state="emailState">
            <b-form-input class="emailInput" type="email" v-model="form.login.email" required v-bind:placeholder="$t('login.placeholder.email')">
            </b-form-input>
          </b-form-group>
          <b-form-group class="passwordInputGroup mb-4" v-bind:label="$t('login.label.password')" label-for="passwordInput" :invalid-feedback="$t(invalidPwdFeedback)" :state="pwdState">
            <b-form-input class="passwordInput" type="password" v-model="form.login.password" required v-bind:placeholder="$t('login.placeholder.password')">
            </b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary" class="w-100 text-uppercase">{{ $t('login.label.login') }}</b-button>
          <div class="d-flex align-items-center justify-content-between mt-1">
            <span class="text-gray">{{ $t('login.label.remember_me') }}</span>
            <switches v-model="form.login.checked" theme="bootstrap" type-bold="true" color="success" class="mb-0"></switches>
          </div>
        </b-form>


        <!-- BANK-ID FORM -->
        <b-form @submit="onSubmitByID" novalidate class="bg-white depth-2 text-left " :validated="validated" v-if="isLoginWithBankID" style="height: 318px">
          <b-form-group class="idInputGroup mb-4" v-bind:label="$t('login.label.social_number')" label-for="idInput" :invalid-feedback="$t(invalidIDFeedback)" :state="idState">
              <div class="idInputContainer">
                <b-form-input class="idInput" type="text" v-model="form.login.id" required v-bind:placeholder="$t('login.placeholder.social_number')">
                </b-form-input>
                <b-img :src="require('../../../assets/img/bank-id.png')" width="24" height="24"/>
              </div>
          </b-form-group>

          <b-button type="submit" variant="primary" class="w-100 text-uppercase">{{ $t("login.label.login") }}</b-button>
          <div class="d-flex align-items-center justify-content-between mt-1">
            <span class="text-gray">{{ $t('login.label.remember_me') }}</span>
            <switches v-model="form.login.checked" theme="bootstrap" type-bold="true" color="success" class="mb-0"></switches>
          </div>
        </b-form>


        <!-- SIGNUP FORM -->
        <b-form @submit="onSignup" novalidate class="bg-white depth-2 text-left" :validated="validated" v-if="isSignup" style="height: 636px">
          <b-form-group class="firstNameInputGroup mb-4" v-bind:label="$t('login.label.firstname')" label-for="firstNameInput" :invalid-feedback="$t(invalidFirstNameFeedback)" :state="firstNameState">
            <b-form-input class="firstNameInput" type="text" v-model="form.signup.firstname" required v-bind:placeholder="$t('login.placeholder.firstname')">
            </b-form-input>
          </b-form-group>
          <b-form-group class="lastNameInputGroup mb-4" v-bind:label="$t('login.label.lastname')" label-for="lastNameInput" :invalid-feedback="$t(invalidLastNameFeedback)" :state="lastNameState">
            <b-form-input class="lastNameInput" type="text" v-model="form.signup.lastname" required v-bind:placeholder="$t('login.placeholder.lastname')">
            </b-form-input>
          </b-form-group>
          <b-form-group class="emailInputGroup mb-4" v-bind:label="$t('login.label.email')" label-for="emailInput" :invalid-feedback="$t(invalidEmailFeedback)" :state="emailState">
            <b-form-input class="emailInput" type="email" v-model="form.signup.email" required v-bind:placeholder="$t('login.placeholder.email')">
            </b-form-input>
          </b-form-group>
          <b-form-group class="passwordInputGroup mb-4" v-bind:label="$t('login.label.password')" label-for="passwordInput" :invalid-feedback="$t(invalidPwdFeedback)" :state="pwdState">
            <b-form-input class="passwordInput" type="password" v-model="form.signup.password" required v-bind:placeholder="$t('login.placeholder.password')">
            </b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary" class="w-100 text-uppercase">{{ $t('login.label.signup') }}</b-button>
          <div class="d-flex align-items-center justify-content-between mt-1">
            <span class="text-gray">{{ $t('login.label.accept_toc') }}</span>
            <switches v-model="form.signup.checkTos" theme="bootstrap" type-bold="true" color="success" class="mb-0"></switches>
          </div>
          <div class="d-flex align-items-center justify-content-between">
            <span class="text-gray">{{ $t('login.label.send_me_newsletter') }}</span>
            <switches v-model="form.signup.checked" theme="bootstrap" type-bold="true" color="success" class="mb-0"></switches>
          </div>
        </b-form>


    </div>
    <div class="bottom mb-4">
      <ul class="d-flex flex-column flex-md-row justify-content-center p-0">
        <li class="mx-2 my-2 text-gray">{{ $t('footer.footer_menu.about_us') }}</li>
        <li class="mx-2 my-2 text-gray">{{ $t('footer.footer_menu.toc') }}</li>
        <li class="mx-2 my-2 text-gray">{{ $t('footer.footer_menu.privacy_policy') }}</li>
        <li class="mx-2 my-2 text-gray">{{ $t('footer.footer_menu.get_in_touch') }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {AUTH_REQUEST} from '@/store/actions/auth'
import EventBus from '../../../event-bus.js'
import Switches from 'vue-switches'

export default {
  name: 'login',
  mounted () {
    if (this.$store.getters.isAuthenticated) {
      this.$router.push('/assumptions/expenses')
    }
  },
  data () {
    return {
      form: {
        login: {
          email: '',
          password: '',
          id: '',
          checked: false
        },
        signup: {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          checked: false,
          checkTos: false
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
        return 'login.errors.valid_4_chars'
      } else {
        return 'login.errors.require_password'
      }
    },
    pwdState () {
      let pwd = this.isLoginWithEmail ? this.form.login.password : this.form.signup.password
      return !this.validated || pwd.length >= 4
    },

    invalidEmailFeedback () {
      let email = this.isLoginWithEmail ? this.form.login.email : this.form.signup.email
      if (email.length < 1) {
        return 'login.errors.require_email'
      } else if (!this.validEmail(email)) {
        return 'login.errors.valid_email'
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
        return 'login.errors.require_swedish_social_num'
      }
    },
    idState () {
      return !this.validated || this.form.login.id.length > 0
    },

    invalidFirstNameFeedback () {
      if (this.form.signup.firstname.length > 0) {
        return ''
      } else {
        return 'login.errors.require_firstname'
      }
    },

    firstNameState () {
      return !this.validated || this.form.signup.firstname.length > 0
    },

    invalidLastNameFeedback () {
      if (this.form.signup.lastname.length > 0) {
        return ''
      } else {
        return 'login.errors.require_lastname'
      }
    },
    lastNameState () {
      return !this.validated || this.form.signup.lastname.length > 0
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
          this.$router.push('/assumptions/expenses')
        }, () => {
          EventBus.$emit('notify-me', {
            title: 'Authentication Failed!',
            text: 'Username or Password is incorrect!',
            status: 'is-danger'
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
  },
  components: {
    Switches
  }
}
</script>

<style lang="scss" >
  @import './style.scss'
</style>
