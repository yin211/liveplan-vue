<template>
  <div class="step2 d-flex">
    <div class="detail-text text-left">
      <p class="font-weight-medium">Time of your income</p>
      <span class="text-gray">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
    </div>
    <div class="space-line"></div>
    <b-container>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex justify-content-end mt-3 pr-0"><label :for="'start_year'">Starts at</label></b-col>
        <b-col sm="9">
          <date-picker id="start_year" v-model="start_year" lang="en" type="year" format="YYYY" >
            <template slot="calendar-icon">
              <i class="flaticon stroke calendar-2 text-primary"></i>
            </template>
          </date-picker>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex justify-content-end mt-3 pr-0"><label :for="'end_year'">Ends at</label></b-col>
        <b-col sm="9">
          <date-picker id="end_year" v-model="end_year" lang="en" type="year" format="YYYY" >
            <template slot="calendar-icon">
              <i class="flaticon stroke calendar-2 text-primary"></i>
            </template>
          </date-picker>
        </b-col>
      </b-row>
    </b-container>

  </div>

</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
  data () {
    return {
      start_year: null,
      end_year: null
    }
  },
  async mounted () {

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
      height: 533px;
      width: 0;
      border: 1px solid #D7D7D7;
      margin-left: 130px;
      margin-right: 130px;
    }

  }
</style>
