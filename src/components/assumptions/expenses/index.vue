<template>
  <div class="expenses bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto">
        <b-link>Incomes</b-link>
        <b-link disabled>Expenses</b-link>
        <b-link>Debts</b-link>
        <b-link>Assets</b-link>
      </div>
      <!-- chart Wrapper -->
      <div class="chart-container">
        <timeline v-if="timelineData && timelineData.data.length"
                  :dataArray="timelineData.data"
                  :label="`blah`"
                  :planStartYear="2012"
                  :planEndYear="2061"
                  :birthYear="1981"></timeline>
      </div>
    </div>
    <div class="table-container">
      <div class="mx-auto bg-light">
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import timeline from '../../charts/timeline'

export default {
  name: 'expenses',
  data () {
    return {
      timelineData: null
    }
  },
  async mounted () {
    try {
      let timelineData = await axios.get('https://api.livsplan.se/api/v1/expenses/')
      this.timelineData = timelineData.data
    } catch (error) {
      console.error(error)
    }
  },
  components: {
    timeline
  }
}
</script>

<style lang="scss">
  @import './style.scss'
</style>
