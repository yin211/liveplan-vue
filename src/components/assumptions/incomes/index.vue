<template>
  <div class="incomes bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto">
        <b-link disabled>Incomes</b-link>
        <b-link to="/assumptions/expenses">Expenses</b-link>
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
        >
        <template slot="name" slot-scope="row">
          <i class="flaticon solid star-2" style="color: #c1c7D0; margin-left: 24px; margin-right: 12px;"></i>
          <span class="font-weight-medium">{{row.item.name}}</span>
        </template>
        <template slot="amount_per_period" slot-scope="row">
          <span>{{row.item.amount_per_period.toLocaleString('sv-SE')}} SEK </span>
        </template>
        <template slot="period" slot-scope="row">
          <span>{{row.item.starts_at_year}} - {{row.item.ends_at_year}}</span>
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
            <i class="flaticon solid down-4 text-success table-title-label-icon"></i>
            <span class="table-title">Incomes</span>
          </div>
        </template>
        <template slot="HEAD_actions" slot-scope="row">
          <button class='btn btn-sm btn-primary font-weight-bold' style="border-radius: 30px; margin: 30px;">
            <i class="flaticon stroke plus"></i>
            Add New Income
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

export default {
  name: 'incomes',
  data () {
    return {
      timelineData: null,
      incomes: [],
      fields: [
        { key: 'name', label: 'Incomes' },
        { key: 'amount_per_period', label: 'Amount' },
        { key: 'period', label: 'Period' },
        { key: 'growth_rate', label: 'Growth Rate', formatter: (value) => { return value ? Math.floor(value) + ' %' : '' } },
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
      let response = await axios.get(`${process.env.ROOT_API}/incomes`)
      this.incomes = response.data.data
      this.totalRows = this.incomes.length
      response = await axios.get(`${process.env.ROOT_API}/persons`)
      this.personOptions = response.data.data

      let timelineData = await axios.get('https://api.livsplan.se/api/v1/incomes/?w_e_amounts=1')
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
  methods: {
    gotoDetail (id) {
      this.$router.push(`/assumptions/incomes/${id}`)
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
