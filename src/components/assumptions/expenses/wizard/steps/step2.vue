<template>
  <div class="step2 d-flex">
    <div class="detail-text text-left">
      <span class="d-flex mb-2 font-weight-medium">Time of your income</span>
      <span class="text-gray">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
    </div>
    <div class="space-line"></div>
    <b-container>
      <b-form-group id="startYearHorizontal"
                horizontal
                breakpoint="md"
                label="Starts at"
                label-for="start_year"
                label-text-align="right"
                label-class="pr-4"
                :invalid-feedback="invalidStartYearFeedback"
                :state="!$v.start_year.$error">
          <date-picker id="start_year" v-model="start_year" lang="en" type="year" format="YYYY" :state="!$v.start_year.$error" @input="$v.start_year.$touch()">
            <template slot="calendar-icon">
              <i class="flaticon stroke calendar-2 text-primary"></i>
            </template>
          </date-picker>
      </b-form-group>
      <b-form-group id="endYearHorizontal"
                horizontal
                breakpoint="md"
                label="Ends at"
                label-for="end_year"
                label-text-align="right"
                label-class="pr-4"
                :invalid-feedback="invalidEndYearFeedback"
                :state="!$v.end_year.$error">
          <date-picker id="end_year" v-model="end_year" lang="en" type="year" format="YYYY" :state="!$v.end_year.$error" @input="$v.end_year.$touch()">
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
import { required } from 'vuelidate/lib/validators'

export default {
  components: { DatePicker },
  data () {
    return {
      start_year: null,
      end_year: null
    }
  },
  validations: {
    start_year: {
      required
    },
    end_year: {
      required
    },
    form: ['start_year', 'end_year']
  },
  methods: {
    validate () {
      this.$v.form.$touch()
      let isValid = !this.$v.form.$invalid
      if (isValid) {
        let data = {
          start_year: this.start_year.getFullYear(),
          end_year: this.end_year.getFullYear()
        }
        this.$emit('validate-success', data)
      }
      return isValid
    }
  },
  computed: {
    invalidStartYearFeedback () {
      if (this.$v.start_year.$error) {
        return 'Start year is required'
      } else {
        return ''
      }
    },
    invalidEndYearFeedback () {
      if (this.$v.end_year.$error) {
        return 'End year is required'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
  .step2 {
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
