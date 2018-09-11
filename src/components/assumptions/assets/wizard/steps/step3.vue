<template>
  <div class="step3 d-flex">
    <div class="detail-text text-left">
      <span class="d-flex mb-2 font-weight-medium">Setting up the Deposit Details</span>
      <span class="text-gray">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
    </div>
    <div class="space-line"></div>
    <b-container>
      <b-form-group id="depositTypeHorizontal"
                horizontal
                breakpoint="md"
                label="Type"
                label-for="depositTypeSelect"
                label-class="d-flex align-items-center justify-content-end pr-4">
        <b-form-select :options="depositTypeOptions" v-model="deposit_type" id="depositTypeSelect" />
      </b-form-group>
      <b-form-group id="depositAmountHorizontal"
                horizontal
                breakpoint="md"
                label="Amount"
                label-for="depositAmountInput"
                label-class="d-flex align-items-center justify-content-end pr-4">
        <div class="d-flex">
          <vue-numeric currency="SEK" currency-symbol-position="suffix" thousand-separator=" " v-model="deposit_amount" id="depositAmountInput" class="form-control border-0 mr-3" :min="0"></vue-numeric>
          <b-form-input v-model="deposit_amount" min="0" max="10000" step="500" class="slider" type="range"></b-form-input>
        </div>
      </b-form-group>
       <b-form-group id="recurrenceHorizontal"
                horizontal
                breakpoint="md"
                label="Recurrence"
                label-for="recurrenceSelect"
                label-class="d-flex align-items-center justify-content-end pr-4">
        <b-form-select :options="deposit_recurrence_options" v-model="deposit_recurrence" id="recurrenceSelect" />
      </b-form-group>
      <b-form-group id="startYearHorizontal"
                horizontal
                breakpoint="md"
                label="Start Year"
                label-for="start_year"
                label-class="d-flex align-items-center justify-content-end pr-4">
          <date-picker id="start_year" v-model="deposit_start_year" :not-before="new Date(new Date().getFullYear(), 0, 1)" lang="en" type="year" format="YYYY" :clearable="false">
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
                label-class="d-flex align-items-center justify-content-end pr-4">
          <date-picker id="end_year" v-model="deposit_end_year" :not-before="new Date(new Date().getFullYear(), 0, 1)" lang="en" type="year" format="YYYY" :clearable="false">
            <template slot="calendar-icon">
              <i class="flaticon stroke calendar-2 text-primary"></i>
            </template>
          </date-picker>
      </b-form-group>
    </b-container>
  </div>

</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
  data () {
    return {
      deposit_type: null,
      deposit_amount: 0,
      depositTypeOptions: [
        { value: null, text: 'Please select', disabled: true },
        { value: 'none', text: 'None' },
        { value: 'fixed_amount', text: 'Fixed amount' },
        { value: 'percentage_amount_of_income', text: 'Percentage amount of income' }
      ],
      deposit_recurrence: null,
      deposit_recurrence_options: [
        { value: null, text: 'Please select', disabled: true },
        { value: 'monthly', text: 'Monthly', display: 'month' },
        { value: 'daily', text: 'Daily', display: 'day' },
        { value: 'weekly', text: 'Weekly', display: 'week' },
        { value: 'quarterly', text: 'Quarterly', display: 'quarter' },
        { value: 'semiannually', text: 'Semiannually', display: 'half-year' },
        { value: 'annually', text: 'Annually', display: 'year' },
        { value: 'onetime', text: 'One time', dispay: 'one time' }
      ],
      deposit_start_year: null,
      deposit_end_year: null
    }
  },
  methods: {
    validate () {
      let data = {
        deposit_type: this.deposit_type,
        deposit_amount: this.deposit_amount,
        deposit_recurrence: this.deposit_recurrence,
        deposit_start_year: this.deposit_start_year ? this.deposit_start_year.getFullYear() : null,
        deposit_end_year: this.deposit_end_year ? this.deposit_end_year.getFullYear() : null
      }
      for (let key in data) {
        if (data[key] == null) {
          delete data[key]
        }
      }
      this.$emit('validate-success', data)
      return true
    }
  }
}
</script>

<style lang="scss">
  .step3 {

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

    #depositTypeSelect, #recurrenceSelect {
      border: none
    }

    #startYearHorizontal, #endYearHorizontal {
      .col-md-9 {
        text-align: left;
      }
    }
  }
</style>
