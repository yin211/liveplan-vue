<template>
  <div class="incomes bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto">
        <b-link disabled>Incomes</b-link>
        <b-link to="/assumptions/expenses">Expenses</b-link>
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
          <span class="mr-3" :class="{ 'selected': !isDerived }">Derived incomes:</span>
          <switches v-model="isDerived" theme="chart" type-bold="false" color="black"></switches>
        </div>
      </div>
      <!-- chart Wrapper -->
      <div class="chart-container">
        <stackedBarChart v-if="isStackedBarChart && stackBarData && stackBarData.length && planStartYear && planEndYear"
                  :dataArray="stackBarData"
                  :label="`income`"
                  :planStartYear="planStartYear"
                  :planEndYear="planEndYear"
                  :birthYear="1981"></stackedBarChart>
        <timeline v-if="!isStackedBarChart && timelineData && timelineData.data.length && planStartYear && planEndYear"
                  :dataArray="timelineData.data"
                  :label="`income`"
                  :planStartYear="planStartYear"
                  :planEndYear="planEndYear"
                  :birthYear="1981"></timeline>
      </div>
    </div>
    <div class="table-container">
      <div class="mx-auto bg-light text-regular text-left">
        <income-table></income-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import timeline from '../../charts/timeline'
import stackedBarChart from '../../charts/stackedBarChart'
import Switches from 'vue-switches'
import incomeTable from '@/components/tables/income'

export default {
  name: 'incomes',
  data () {
    return {
      stackBarData: null,
      timelineData: null,
      planStartYear: null,
      planEndYear: null,
      isStackedBarChart: true,
      isDerived: true
    }
  },
  async mounted () {
    try {
      let stackBarData = await axios.get(`${process.env.ROOT_API}/cashflow/sums?plan_id=1&object_class=income&aggregated=0`)
      this.stackBarData = stackBarData.data
      let timelineData = await axios.get(`${process.env.ROOT_API}/incomes/?with_amounts=1`)
      this.timelineData = timelineData.data
      let plansResponse = await axios.get(`${process.env.ROOT_API}/plans/1`)
      this.planStartYear = plansResponse.data.start_year
      this.planEndYear = plansResponse.data.end_year
    } catch (error) {
      console.error(error)
    }
  },
  components: {
    stackedBarChart,
    timeline,
    Switches,
    incomeTable
  }
}
</script>
