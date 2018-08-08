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
        <stackedBarChart v-if="timelineData && timelineData.data.length"
                  :dataArray="timelineData.data"
                  :label="`blah`"
                  :planStartYear="2012"
                  :planEndYear="2061"
                  :birthYear="1981"></stackedBarChart>
      </div>
    </div>
    <div class="table-container">
      <div class="mx-auto bg-light text-regular text-left">
        <b-table show-empty
                stacked="md"
                :items="expenses"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
        >
        <template slot="amount" slot-scope="row">
          <span>{{row.item.amount.toLocaleString('sv-SE')}} SEK </span>
        </template>
        <template slot="period" slot-scope="row">
          <span>{{row.item.start_year}} - {{row.item.end_year}}</span>
        </template>
        <template slot="actions" slot-scope="row">
          <button class='btn plain-btn text-regular'>
            <i class="flaticon stroke up-2 text-primary"></i> Show On Graph
          </button>
          <button class='btn plain-btn text-regular'>
            <i class="flaticon stroke right-circle-2 text-primary"></i> Open
          </button>
        </template>
        </b-table>
        <div class="d-flex  flex-column flex-md-row justify-content-between">
          <div class="d-flex flex-column flex-md-row mb-3 mb-md-0">
            <div v-if="totalRows > 0" class="d-flex align-items-center justify-content-center">
              <span class="text-gray">Showing {{(currentPage - 1) * perPage + 1}} to {{endRecord}} of {{totalRows}}</span>
            </div>
            <div v-if="totalRows > 0" class="space-divider"></div>
            <div class="d-flex align-items-center justify-content-center">
              <span> show per page: </span>
              <b-form-select :options="pageOptions" v-model="perPage" class="selectPerPage" />
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-center">
            <b-pagination :total-rows="totalRows" :per-page="perPage" :prev-text="'Prev'" :next-text="'Next'" v-model="currentPage" class="my-0"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import stackedBarChart from '../../charts/stackedBarChart'

export default {
  name: 'expenses',
  data () {
    return {
      timelineData: null,
      expenses: [],
      fields: [
        { key: 'name', label: 'Expenses' },
        { key: 'period', label: 'Period' },
        { key: 'amount', label: 'Amount' },
        { key: 'annual_increase_percentage', label: 'Growth Rate', formatter: (value) => { return value ? value + ' %' : '' } },
        { key: 'person_id',
          label: 'Person',
          formatter: (value) => {
            let f = this.personOptions.filter(option => option.id === value)
            if (f.length) {
              return f[0].name
            }
          }
        },
        { key: 'actions', 'class': 'd-lg-flex justify-content-lg-end align-items-center' }
      ],
      currentPage: 1,
      perPage: 10,
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      pageOptions: [ 5, 10, 15, 25 ],
      totalRows: 0,
      personOptions: []
    }
  },
  async mounted () {
    try {
      let response = await axios.get(`${process.env.ROOT_API}/expenses`)
      this.expenses = response.data.data
      this.totalRows = this.expenses.length
      response = await axios.get(`${process.env.ROOT_API}/persons`)
      this.personOptions = response.data.data

      let timelineData = await axios.get('https://api.livsplan.se/api/v1/expenses/?w_e_amounts=1')
      this.timelineData = timelineData.data
    } catch (error) {
      console.error(error)
    }
  },
  computed: {
    endRecord () {
      if (this.perPage * this.currentPage < this.totalRows) {
        return this.perPage * this.currentPage
      } else {
        return this.totalRows
      }
    }
  },
  components: {
    stackedBarChart
  }
}
</script>

<style lang="scss">
  @import './style.scss'
</style>
