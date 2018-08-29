<template>
  <div class="incomes bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto">
        <b-link disabled>Incomes</b-link>
        <b-link to="/assumptions/expenses">Expenses</b-link>
        <b-link to="/assumptions/debts">Debts</b-link>
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
        <b-table show-empty
                stacked="md"
                :items="incomes"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                :filter="filter"
                @filtered="onFiltered"
        >
        <template slot="top-row" slot-scope="data">
          <td colspan="6">
            <div class="d-flex align-items-center">
              <i class="fa fa-search"></i>
              <b-form-input v-model="filter" size="sm" placeholder="Type to Search" />
            </div>
          </td>
        </template>
        <template slot="name" slot-scope="row">
          <div class="d-flex">
            <i class="flaticon solid star-2"></i>
            <span class="font-weight-bold">{{row.item.name}}</span>
          </div>
        </template>
        <template slot="amount" slot-scope="row">
          <span>{{row.item.amount.toLocaleString('sv-SE')}} SEK </span>
        </template>
        <template slot="period" slot-scope="row">
          <span>{{row.item.start_year}} - {{row.item.end_year}}</span>
        </template>
        <template slot="actions" slot-scope="row">
          <div class="d-flex flex-column flex-md-row align-items-start">
            <button class='btn plain-btn text-regular'>
              <i class="flaticon solid up-2 text-primary"></i> Show On Graph
            </button>
            <button class='btn plain-btn text-regular' @click.stop="gotoDetail(row.item.id)">
              <i class="flaticon solid right-circle-2 text-primary"></i> Open
            </button>
          </div>
        </template>
        <template slot="HEAD_name" slot-scope="row">
          <div class="d-flex align-items-center">
            <div class="table-title-label"></div>
            <i class="fa fa-long-arrow-down text-success table-title-label-icon"></i>
            <span class="table-title">Incomes</span>
          </div>
        </template>
        <template slot="HEAD_actions" slot-scope="row">
          <button class='btn btn-sm btn-primary font-weight-bold add-new-row d-none d-sm-block' @click.stop="$router.push('/assumptions/incomes/add-income')">
            <i class="flaticon stroke plus"></i>
            Add New Income
          </button>
          <button class='btn btn-sm btn-primary font-weight-bold add-new-row d-block d-sm-none'>
            <i class="flaticon stroke plus"></i>
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
import timeline from '../../charts/timeline'
import stackedBarChart from '../../charts/stackedBarChart'
import Switches from 'vue-switches'

export default {
  name: 'incomes',
  data () {
    return {
      stackBarData: null,
      timelineData: null,
      planStartYear: null,
      planEndYear: null,
      incomes: [],
      fields: [
        { key: 'name', label: 'Incomes', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true },
        { key: 'period', label: 'Period', sortable: true },
        { key: 'annual_growth_rate', label: 'Annual Growth Rate', formatter: (value) => { return value ? Math.floor(value) + ' %' : '' }, sortable: true },
        { key: 'person_id',
          label: 'Person',
          formatter: (value) => {
            let f = this.personOptions.filter(option => option.id === value)
            if (f.length) {
              return f[0].name
            }
          },
          sortable: true
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
      filter: null,
      personOptions: [],
      isStackedBarChart: true
    }
  },
  async mounted () {
    try {
      let response = await axios.get(`${process.env.ROOT_API}/incomes`)
      this.incomes = response.data.data
      this.totalRows = this.incomes.length
      response = await axios.get(`${process.env.ROOT_API}/persons`)
      this.personOptions = response.data.data

      let stackBarData = await axios.get(`${process.env.ROOT_API}/cashflow/sums?plan_id=1&object_class=income&aggregated=0`)
      this.stackBarData = stackBarData.data
      let timelineData = await axios.get(`${process.env.ROOT_API}/incomes/?with_amounts=1`)
      this.timelineData = timelineData.data
      let plansResponse = await axios.get(`${process.env.ROOT_API}/plans/1`)
      this.planStartYear = plansResponse.data.data.start_year
      this.planEndYear = plansResponse.data.data.end_year
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
  methods: {
    gotoDetail (id) {
      this.$router.push(`/assumptions/incomes/${id}`)
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },
  components: {
    stackedBarChart,
    timeline,
    Switches
  }
}
</script>

<style lang="scss">
  @import './style.scss'
</style>
