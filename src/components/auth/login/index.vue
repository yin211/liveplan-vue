<template>
  <div class="login d-flex justify-content-between flex-column">
    <div class="main d-flex justify-content-center bg-light">
        <ul class="d-flex flex-column justify-content-end align-items-end mb-5">
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

          <b-form-group class="rememberGroup mt-2 mb-4">
            <b-form-checkbox-group v-model="form.login.checked" class="rememberCheck">
              <b-form-checkbox class="text-gray">{{ $t('login.label.remember_me') }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-button type="submit" variant="primary" class="w-100 text-uppercase">{{ $t('login.label.login') }}</b-button>
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

          <b-form-group class="rememberGroup mt-2 mb-4">
            <b-form-checkbox-group v-model="form.login.checked" class="rememberCheck">
              <b-form-checkbox class="text-gray">{{ $t('login.label.remember_me') }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-button type="submit" variant="primary" class="w-100 text-uppercase">{{ $t("login.label.login") }}</b-button>
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
          <b-form-group class="tocGroup mt-2 mb-4">
            <b-form-checkbox-group v-model="form.signup.checkTos" class="tocCheckbox">
              <b-form-checkbox class="text-gray">{{ $t('login.label.accept_toc') }}</b-form-checkbox>
            </b-form-checkbox-group>
            <b-form-checkbox-group v-model="form.signup.checked" class="newsletterCheckbox">
              <b-form-checkbox class="text-gray">{{ $t('login.label.send_me_newsletter') }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>

          <b-button type="submit" variant="primary" class="w-100 text-uppercase">{{ $t('login.label.signup') }}</b-button>
        </b-form>


    </div>
    <div class="bottom mb-4">
      <ul class="d-flex justify-content-center">
        <li class="mx-2 text-gray">{{ $t('footer.footer_menu.about_us') }}</li>
        <li class="mx-2 text-gray">{{ $t('footer.footer_menu.toc') }}</li>
        <li class="mx-2 text-gray">{{ $t('footer.footer_menu.privacy_policy') }}</li>
        <li class="mx-2 text-gray">{{ $t('footer.footer_menu.get_in_touch') }}</li>
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
      this.$router.push('/assumptions/expense/1')
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
          this.$router.push('/assumptions/expense/1')
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

<style lang="scss" >
  @import './style.scss'
</style>
