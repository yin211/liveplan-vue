<template>
  <div class="overview bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto">
        <b-link>Cashflow</b-link>
        <b-link>Equity</b-link>
        <b-link>Timeline</b-link>
        <b-link>Portfolio</b-link>
      </div>
      <!-- chart Wrapper -->
      <div class="chart-container">
        <overviewCashflow
          v-if="cashflow"
          :dataArray="cashflow"
          :birthYear="1981">
        </overviewCashflow>
      </div>
    </div>
    <div class="table-container">
      <div class="mx-auto bg-light text-regular text-left">
        <income-table class="mb-5"></income-table>
        <expense-table class="mb-5"></expense-table>
        <asset-table class="mb-5"></asset-table>
        <debt-table></debt-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import incomeTable from '@/components/tables/income'
import expenseTable from '@/components/tables/expense'
import assetTable from '@/components/tables/asset'
import debtTable from '@/components/tables/debt'
import overviewCashflow from '@/components/charts/overviewCashflow'

export default {
  name: 'overview',
  data () {
    return {
      cashflow: null
    }
  },
  async mounted () {
    let cashflowRawData = await axios.get(`${process.env.ROOT_API}/cashflow/graph?plan_id=1&aggregated=1&shortfall_negative=1`)
    this.cashflow = this.processCashflow(cashflowRawData.data)
  },
  methods: {
    processCashflow (cashflowRawData) {
      let cashflow = []
      let surplus = cashflowRawData.filter(x => x.label === 'surplus')[0]
      let shortfall = cashflowRawData.filter(x => x.label === 'shortfall')[0]

      let surplusKeys = Object.keys(surplus).filter(x => x !== 'plan_id' && x !== 'label' && x !== 'with_dbaa_and_aga')
      for (let y = +surplusKeys[0]; y <= +surplusKeys[0] + surplusKeys.length; y++) {
        if (surplus.hasOwnProperty(y) && +surplus[y] !== 0) {
          cashflow.push({
            name: 'surplus',
            year: y,
            value: +surplus[y]
          })
        } else if (shortfall.hasOwnProperty(y) && +shortfall[y] !== 0) {
          cashflow.push({
            name: 'shortfall',
            year: y,
            value: +shortfall[y]
          })
        } else {
          cashflow.push({
            name: '',
            year: y,
            value: 0
          })
        }
      }
      return cashflow
    }
  },
  components: {
    incomeTable,
    expenseTable,
    assetTable,
    debtTable,
    overviewCashflow
  }
}
</script>

<style lang="scss">
 @import './style.scss'
</style>
