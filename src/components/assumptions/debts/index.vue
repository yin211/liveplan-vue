<template>
  <div class="debts bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto">
        <b-link to="/assumptions/incomes">Incomes</b-link>
        <b-link to="/assumptions/expenses">Expenses</b-link>
        <b-link disabled>Debts</b-link>
        <b-link to="/assumptions/assets">Assets</b-link>
      </div>
      <div class="chart-switcher" v-if="planStartYear && planEndYear">
        <div class="d-flex align-items-center">
          <span class="mr-3" :class="{ 'selected': !isStackedBarChart }">Timeline</span>
          <switches v-model="isStackedBarChart" theme="chart" type-bold="false" color="black"></switches>
          <span class="ml-3" :class="{ 'selected': isStackedBarChart }">Barchart</span>
        </div>
      </div>
      <!-- chart Wrapper -->
      <div class="chart-container">
        <stackedBarChart v-if="isStackedBarChart && stackBarData && stackBarData.length && planStartYear && planEndYear"
          :dataArray="stackBarData"
          :label="`debt`"
          :planStartYear="planStartYear"
          :planEndYear="planEndYear"
          :birthYear="1981"></stackedBarChart>
        <timeline v-if="!isStackedBarChart && timelineData && timelineData.data.length && planStartYear && planEndYear"
          :dataArray="timelineData.data"
          :label="`debt`"
          :planStartYear="planStartYear"
          :planEndYear="planEndYear"
          :birthYear="1981"></timeline>
      </div>
    </div>
    <div class="table-container">
      <div class="mx-auto bg-light text-regular text-left">
        <debt-table></debt-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import stackedBarChart from '../../charts/stackedBarChart'
import timeline from '../../charts/timeline'
import Switches from 'vue-switches'
import debtTable from '@/components/tables/debt'

export default {
  name: 'debts',
  data () {
    return {
      stackBarData: null,
      timelineData: null,
      planStartYear: null,
      planEndYear: null,
      isStackedBarChart: true
    }
  },
  async mounted () {
    try {
      let stackBarData = await axios.get(`${process.env.ROOT_API}/cashflow/sums?plan_id=1&object_class=debt&aggregated=0`)
      this.stackBarData = stackBarData.data
      let timelineData = await axios.get(`${process.env.ROOT_API}/debts/?with_amounts=1`)
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
    debtTable
  }
}
</script>
