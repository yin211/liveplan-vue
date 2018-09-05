<template>
  <div class="step4 d-flex">
    <div class="detail-text text-left">
      <span class="d-flex mb-2 font-weight-medium">Setting up the withdrawal Details</span>
      <span class="text-gray">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
    </div>
    <div class="space-line"></div>
    <b-container>
      <b-form-group id="withdrawalTypeHorizontal"
                horizontal
                breakpoint="md"
                label="Type"
                label-for="withdrawalTypeSelect"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidwithdrawalTypeFeedback"
                :state="!$v.withdrawal_type.$error">
        <b-form-select :options="withdrawalTypeOptions" v-model="withdrawal_type" id="withdrawalTypeSelect" :state="!$v.withdrawal_type.$error" @input="$v.withdrawal_type.$touch()"/>
      </b-form-group>
      <b-form-group id="withdrawalAmountHorizontal"
                horizontal
                breakpoint="md"
                label="Amount"
                label-for="withdrawalAmountInput"
                label-class="d-flex align-items-center justify-content-end pr-4">
        <div class="d-flex">
          <vue-numeric v-if="withdrawal_type === 'fixed_amount'" currency="SEK" currency-symbol-position="suffix" thousand-separator=" " v-model="withdrawal_amount" id="withdrawalAmountInput" class="form-control border-0 mr-3" :min="0"></vue-numeric>
          <vue-numeric v-else currency="%" currency-symbol-position="suffix" v-model="withdrawal_amount" :min="0" :max="25" class="form-control border-0 mr-3"></vue-numeric>
          <b-form-input v-if="withdrawal_type === 'fixed_amount'" v-model="withdrawal_amount" min="0" max="100000" step="5000" class="slider" type="range"></b-form-input>
          <b-form-input v-else v-model="withdrawal_amount" min="0" max="25" class="slider" type="range"></b-form-input>
        </div>
      </b-form-group>
       <b-form-group id="periodHorizontal"
                horizontal
                breakpoint="md"
                label="Period"
                label-for="periodSelect"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidPeriodFeedback"
                :state="!$v.withdrawal_period.$error">
        <b-form-select :options="withdrawal_period_options" v-model="withdrawal_period" id="periodSelect" :state="!$v.withdrawal_period.$error" @input="$v.withdrawal_period.$touch()"/>
      </b-form-group>
      <b-form-group id="startYearHorizontal"
                horizontal
                breakpoint="md"
                label="Start Year"
                label-for="start_year"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidStartYearFeedback"
                :state="!$v.withdrawal_start_year.$error">
          <date-picker id="start_year" v-model="withdrawal_start_year" :not-before="new Date(new Date().getFullYear(), 0, 1)" lang="en" type="year" format="YYYY" :clearable="false" :state="!$v.withdrawal_start_year.$error" @input="$v.withdrawal_start_year.$touch()">
            <template slot="calendar-icon">
              <i class="flaticon stroke calendar-2 text-primary"></i>
            </template>
          </date-picker>
      </b-form-group>
      <b-form-group id="endYearHorizontal"
                horizontal
                breakpoint="md"
                label="End Year"
                label-for="end_year"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidEndYearFeedback"
                :state="!$v.withdrawal_end_year.$error">
          <date-picker id="end_year" v-model="withdrawal_end_year" :not-before="new Date(new Date().getFullYear(), 0, 1)" lang="en" type="year" format="YYYY" :clearable="false" :state="!$v.withdrawal_end_year.$error" @input="$v.withdrawal_end_year.$touch()">
            <template slot="calendar-icon">
              <i class="flaticon stroke calendar-2 text-primary"></i>
            </template>
          </date-picker>
      </b-form-group>
    </b-container>
  </div>

</template>

<script>
import { required } from 'vuelidate/lib/validators'
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
  data () {
    return {
      withdrawal_type: null,
      withdrawal_amount: 0,
      withdrawalTypeOptions: [
        { value: null, text: 'Please select', disabled: true },
        { value: 'none', text: 'None' },
        { value: 'fixed_amount', text: 'Fixed amount' },
        { value: 'percentage_amount', text: 'Percentage amount' }
      ],
      withdrawal_period: null,
      withdrawal_period_options: [
        { value: null, text: 'Please select', disabled: true },
        { value: 'one_time', text: 'One time', dispay: 'one time' },
        { value: 'month', text: 'Month', display: 'month' },
        { value: 'year', text: 'Year', display: 'year' },
        { value: 'none', text: 'None', display: 'none' }
      ],
      withdrawal_start_year: null,
      withdrawal_end_year: null
    }
  },
  validations: {
    withdrawal_type: {
      required
    },
    withdrawal_amount: {
      required
    },
    withdrawal_period: {
      required
    },
    withdrawal_start_year: {
      required
    },
    withdrawal_end_year: {
      required
    },
    form: ['withdrawal_type', 'withdrawal_amount', 'withdrawal_period', 'withdrawal_start_year', 'withdrawal_end_year']
  },
  methods: {
    validate () {
      this.$v.form.$touch()
      let isValid = !this.$v.form.$invalid
      if (isValid) {
        let data = {
          withdrawal_type: this.withdrawal_type,
          withdrawal_amount: this.withdrawal_amount,
          withdrawal_period: this.withdrawal_period,
          withdrawal_start_year: this.withdrawal_start_year.getFullYear(),
          withdrawal_end_year: this.withdrawal_end_year.getFullYear()
        }
        this.$emit('validate-success', data)
      }
      return isValid
    }
  },
  computed: {
    invalidwithdrawalTypeFeedback () {
      if (this.$v.withdrawal_type.$error) {
        return 'Deposit Type is required'
      } else {
        return ''
      }
    },
    invalidPeriodFeedback () {
      if (this.$v.withdrawal_period.$error) {
        return 'Withdrawal Period is required'
      } else {
        return ''
      }
    },
    invalidStartYearFeedback () {
      if (this.$v.withdrawal_start_year.$error) {
        return 'Start year is required'
      } else {
        return ''
      }
    },
    invalidEndYearFeedback () {
      if (this.$v.withdrawal_end_year.$error) {
        return 'End year is required'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
  .step4 {

    .detail-text {
      margin-top: 164px;
      min-width: 436px;
      max-width: 436px;
    }

    .space-line {
      height: 533px;
      width: 0;
      border: 1px solid #D7D7D7;
      margin-left: 130px;
      margin-right: 130px;
    }

    #startYearHorizontal, #endYearHorizontal {
      .col-md-9 {
        text-align: left;
      }

      &.is-invalid {
        .mx-datepicker {
          border: 1px solid #EF5350;

          .mx-input {
            border-radius: 0;
            border-right: 1px solid #EF5350;
          }
        }
      }
    }
  }
</style>
