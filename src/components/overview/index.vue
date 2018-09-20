<template>
  <div class="overview bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto d-flex justify-content-center px-3">
        <div class="d-flex flex-column">
          <b-link disabled>Cashflow</b-link>
          <b-dropdown id="menu" text="Dropdown Button" class="mt-2" size="sm">
            <template slot="button-content">
              <span class="font-weight-bold">{{ selectedLevel.text }}</span>
            </template>
            <b-dropdown-item-button v-for="level in levels" :key="level.id" @click="selectLevel(level)" class="d-flex align-items-center pl-3 py-1">
              {{ level.text }}
            </b-dropdown-item-button>
          </b-dropdown>
        </div>
        <b-link>Equity</b-link>
        <b-link>Portfolio</b-link>
      </div>
      <!-- <div class="whatIf-container">
        <what-if></what-if>
      </div> -->
      <!-- chart Wrapper -->
      <div class="chart-container">
        <basicCashflow
          v-if="selectedLevel.id == 'level0' && cashflow"
          :dataArray="cashflow"
          :birthYear="1981">
        </basicCashflow>
        <aggregatedCashflow
          v-if="selectedLevel.id == 'level1' && aggregated"
          :dataObject="aggregated"
          :birthYear="1981">
        </aggregatedCashflow>
      </div>
    </div>
    <div class="table-container">
      <div class="mx-auto bg-light text-regular text-left">
        <income-table class="mb-5"></income-table>
        <expense-table class="mb-5"></expense-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import incomeTable from '@/components/tables/income'
import expenseTable from '@/components/tables/expense'
import basicCashflow from '@/components/charts/basicCashflow'
import aggregatedCashflow from '@/components/charts/aggregatedCashflow'
// import whatIf from '@/components/overview/whatIf/index'

export default {
  name: 'overview',
  data () {
    return {
      cashflow: null,
      aggregated: null,
      selectedLevel: {id: 'level0', text: 'level 0 - Basic'},
      levels: [
        {id: 'level0', text: 'level 0 - Basic'},
        {id: 'level1', text: 'level 1 - Aggregate'},
        {id: 'level2', text: 'level 2 - Detailed'}
      ]
    }
  },
  async mounted () {
    let cashflowRawData = await axios.get(`${process.env.ROOT_API}/cashflow/graph?plan_id=1&aggregated=1&shortfall_negative=1`)
    this.cashflow = this.processCashflow(cashflowRawData.data)
    let aggregated = await axios.get(`${process.env.ROOT_API}/cashflow/graph/detailed/income`)
    this.aggregated = this.processAggregatedCashflow(aggregated.data)
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
    },
    processAggregatedCashflow (cashflowRawData) {
      if (!cashflowRawData.length) {
        return {
          income: [],
          expense: []
        }
      }
      let nested = this.$d3.nest().key(d => d.object_class).entries(cashflowRawData)
      return {
        income: nested.filter(x => x.key === 'income')[0].values.map(d => this.convertToObjectArray(d)),
        expense: nested.filter(x => x.key === 'expense')[0].values.map(d => this.convertToObjectArray(d))
      }
    },
    convertToObjectArray (obj) {
      let keys = this.$d3.keys(obj).filter(x => x !== 'plan_id' && !x.includes('object'))
      let values = keys.map(year => {
        return {
          year: +year,
          value: +obj[year]
        }
      })
      values.object_class = obj.object_class
      values.object_type = obj.object_type
      values.object_subtype = obj.object_subtype
      return values
    },
    selectLevel (level) {
      this.selectedLevel = level
    }
  },
  components: {
    incomeTable,
    expenseTable,
    basicCashflow,
    aggregatedCashflow
  }
}
</script>

<style lang="scss">
 @import './style.scss'
</style>
