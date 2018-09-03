<template>
  <div class="step3 d-flex">
    <div class="detail-text text-left">
      <span class="d-flex mb-2 font-weight-medium">Couple Advanced Settings</span>
      <span class="text-gray">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
    </div>
    <div class="space-line"></div>
    <b-container class="p-0">
      <b-form-group id="growthRateHorizontal"
                horizontal
                breakpoint="md"
                label="Interest Rate"
                label-for="interest-rate"
                label-class="d-flex align-items-center justify-content-end pr-4">
        <div class="d-flex">
          <vue-numeric currency="%" currency-symbol-position="suffix" v-model="interest_rate" class="form-control border-0 mr-3" id="interest-rate" :min="0" :max="25" style="width: 100px;"></vue-numeric>
          <b-form-input v-model="interest_rate" min="0" max="25" class="slider" type="range"></b-form-input>
        </div>
      </b-form-group>
      <b-form-group id="currencyHorizontal"
                horizontal
                breakpoint="md"
                label="Currency"
                label-for="currency-select"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidCurrencyFeedback"
                :state="!$v.currency_id.$error">
        <b-form-select :options="currencyOptions" :value-field="'id'" :text-field="'name'" v-model="currency_id" id="currency-select" :state="!$v.currency_id.$error" @input="$v.currency_id.$touch()"/>
      </b-form-group>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      currencyOptions: [],
      currency_id: 1,
      interest_rate: 0
    }
  },
  async mounted () {
    try {
      let response = await axios.get(`${process.env.ROOT_API}/currencies`)
      this.currencyOptions = response.data.data
    } catch (err) {
      console.log(err)
    }
  },
  validations: {
    currency_id: {
      required
    },
    form: ['currency_id']
  },
  methods: {
    validate () {
      this.$v.form.$touch()
      let isValid = !this.$v.form.$invalid
      if (isValid) {
        let data = {
          currency_id: this.currency_id,
          interest_rate: this.interest_rate
        }
        this.$emit('validate-success', data)
      }
      return isValid
    }
  },
  computed: {
    invalidCurrencyFeedback () {
      if (this.$v.currency_id.$error) {
        return 'Currency is required'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
  .step3 {
    .detail-text {
      margin-top: 42px;
      min-width: 436px;
      max-width: 436px;
    }

    .space-line {
      height: 175px;
      width: 0;
      border: 1px solid #D7D7D7;
      margin-left: 130px;
      margin-right: 130px;
    }

  }
</style>
