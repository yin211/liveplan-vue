<template>
  <div class="login d-flex justify-content-between flex-column">
    <div class="main d-flex justify-content-center secondary-bg-color">
        <ul class="d-flex flex-column justify-content-end align-items-end mb-5">
          <li class="elem-active">LOGIN WITH EMAIL</li>
          <li>LOGIN WITH MOBILE BANKID</li>
          <li>SIGNUP FOR LIVSPLAN</li>
        </ul>
        <b-form @submit="onSubmit" class="bg-white depth-2 text-left">
          <b-form-group id="emailInputGroup" label="Email" label-for="emailInput" class="mb-4">
            <b-form-input id="emailInput" type="email" v-model="form.email" required placeholder="Type here">
            </b-form-input>
          </b-form-group>
          <b-form-group id="passwordInputGroup" label="Password" label-for="passwordInput" class="mb-4">
            <b-form-input id="passwordInput" type="text" v-model="form.password" required placeholder="Type here">
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
export default {
  name: 'login',
  data () {
    return {
      form: {
        email: '',
        name: ''
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .login {
    height: calc(100vh - 102px);

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
