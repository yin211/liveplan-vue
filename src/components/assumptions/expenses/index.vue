<template>
  <div class="expenses bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto">
        <b-link to="/assumptions/incomes">Incomes</b-link>
        <b-link disabled>Expenses</b-link>
        <b-link to="/assumptions/debts">Debts</b-link>
        <b-link to="/assumptions/assets">Assets</b-link>
      </div>
      <div class="chart-switcher d-flex flex-column flex-sm-row" v-if="planStartYear && planEndYear">
        <div class="d-flex align-items-center mr-4">
          <span class="mr-3" :class="{ 'selected': !isStackedBarChart }">Timeline</span>
          <switches v-model="isStackedBarChart" theme="chart" type-bold="false" color="black"></switches>
          <span class="ml-3" :class="{ 'selected': isStackedBarChart }">Barchart</span>
        </div>
        <div class="d-flex align-items-center">
          <span class="mr-3" :class="{ 'selected': !is_not_derived }">Derived expenses:</span>
          <switches v-model="is_not_derived" theme="chart" type-bold="false" color="black"></switches>
        </div>
      </div>
      <!-- chart Wrapper -->
      <div class="chart-container">
        <stackedBarChart v-if="isStackedBarChart && stackedData && stackedData.length && planStartYear && planEndYear"
                  :dataArray="stackedData"
                  :label="`expense`"
                  :planStartYear="planStartYear"
                  :planEndYear="planEndYear"
                  :birthYear="1981"></stackedBarChart>
        <timeline v-if="!isStackedBarChart && timelineData && timelineData.data.length && planStartYear && planEndYear"
                  :dataArray="timelineData.data"
                  :label="`expense`"
                  :planStartYear="planStartYear"
                  :planEndYear="planEndYear"
                  :birthYear="1981"></timeline>
      </div>
    </div>
    <div class="table-container">
      <div class="mx-auto bg-light text-regular text-left">
        <expense-table></expense-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import stackedBarChart from '../../charts/stackedBarChart'
import timeline from '../../charts/timeline'
import Switches from 'vue-switches'
import expenseTable from '@/components/tables/expense'

export default {
  name: 'expenses',
  data () {
    return {
      stackedData: null,
      timelineData: null,
      planStartYear: null,
      planEndYear: null,
      isStackedBarChart: true,
      is_not_derived: true
    }
  },
  async mounted () {
    try {
      let stackedData = await axios.get(`${process.env.ROOT_API}/cashflow/sums?plan_id=1&object_class=expense&aggregated=0&with_derived_objects=0`)
      this.stackedData = stackedData.data
      let timelineData = await axios.get(`${process.env.ROOT_API}/expenses/?with_amounts=1`)
      this.timelineData = timelineData.data
      let plansResponse = await axios.get(`${process.env.ROOT_API}/plans/1`)
      this.planStartYear = plansResponse.data.start_year
      this.planEndYear = plansResponse.data.end_year
    } catch (error) {
      console.error(error)
    }
  },
  watch: {
    is_not_derived: async function (val) {
      if (val) {
        let stackedData = await axios.get(`${process.env.ROOT_API}/cashflow/sums?plan_id=1&object_class=expense&aggregated=0&with_derived_objects=0`)
        this.stackedData = stackedData.data
      } else {
        let stackedData = await axios.get(`${process.env.ROOT_API}/cashflow/sums?plan_id=1&object_class=expense&aggregated=0&with_derived_objects=1`)
        this.stackedData = stackedData.data
      }
    }
  },
  components: {
    stackedBarChart,
    timeline,
    Switches,
    expenseTable
  }
}
</script>
