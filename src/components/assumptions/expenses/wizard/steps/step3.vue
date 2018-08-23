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
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex justify-content-end mt-3"><label :for="'annual-growth-rate'">Growth Rate</label></b-col>
        <b-col sm="9" class="d-flex">
          <vue-numeric currency="%" currency-symbol-position="suffix" v-model="annual_increase_percentage" class="form-control border-0 mr-3" id="annual-growth-rate" :min="0" :max="10" style="width: 100px;"></vue-numeric>
          <b-form-input v-model="annual_increase_percentage" min="0" max="10" class="slider" type="range"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex justify-content-end mt-3"><label :for="'inflation-input'">Inflation</label></b-col>
        <b-col sm="9" class="d-flex">
          <vue-numeric currency="%" currency-symbol-position="suffix" v-model="inflation_rate" class="form-control border-0 mr-3" id="inflation-input" :min="0" :max="10" style="width: 100px;"></vue-numeric>
          <b-form-input v-model="inflation_rate" min="0" max="10" class="slider" type="range"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'currency-select'">Currency</label></b-col>
        <b-col sm="9">
          <b-form-select :options="currencyOptions" :value-field="'id'" :text-field="'name'" v-model="currency_id" :id="'currency-select'" class="border-0"/>
        </b-col>
      </b-row>
    </b-container>

  </div>

</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      currencyOptions: [],
      currency_id: null,
      annual_increase_percentage: 0,
      inflation_rate: 0
    }
  },
  async mounted () {
    try {
      let response = await axios.get(`${process.env.ROOT_API}/currencies`)
      this.currencyOptions = response.data.data
    } catch (err) {
      console.log(err)
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
