<template>
  <div class="expense bg-light">
    <b-breadcrumb :items="items" class="p-0"/>
    <b-container fluid class="px-0 text-left">
      <h1 class="text-regular">Car Rental</h1>
      <b-row class="pt-2">
          <b-col md="6">
            <p class="text-regular" style="margin-bottom: 10px">Explanation</p>
            <p class="text-gray">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </b-col>
          <b-col md="6">
            <p class="text-regular" style="margin-bottom: 10px">Description</p>
            <p class="text-gray">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </b-col>
      </b-row>
    </b-container>
    <section>
      <b-card style="margin-top: 40px;">
        <b-form class="text-left">
          <b-container fluid class="px-0">
            <b-row>
              <b-col lg="5">
                <b-row>
                  <b-col sm="4" class="d-flex flex-row align-items-center">
                    <i class="fa fa-car car-icon"></i>
                    <div class="d-flex flex-column ml-3">
                      <span class="text-gray">Category</span>
                      <span class="text-regular">Car</span>
                    </div>
                  </b-col>
                  <b-col sm="4">
                    <span class="text-regular">Start - End Year</span>
                    <div class="d-flex">
                      <b-form-input v-model="start_year" type="number" size="sm"></b-form-input>
                      <span class="date-spacer">-</span>
                      <b-form-input v-model="end_year" type="number" size="sm"></b-form-input>
                    </div>
                  </b-col>
                  <b-col sm="4">
                    <span class="text-regular">Amount Per Month</span>
                    <b-input-group size="sm" append="SEK">
                      <b-form-input v-model="amount_per_month" type="number"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
              </b-col>
              <b-col lg="7">
                <b-row>
                  <b-col cols="12" md="8">
                    <b-row>
                      <b-col sm="4">
                        <span class="text-regular">Period</span>
                        <b-form-select v-model="period" :options="periodOptions" size="sm"/>
                      </b-col>
                      <b-col sm="4">
                        <span class="text-regular">Annual Growth Rate</span>
                        <b-input-group size="sm" append="%" class="w-75">
                          <b-form-input v-model="annual_growth_rate" type="number"></b-form-input>
                        </b-input-group>
                      </b-col>
                      <b-col sm="3">
                        <span class="text-regular">Inflation</span>
                        <b-input-group size="sm" append="%">
                          <b-form-input v-model="inflation" type="number"></b-form-input>
                        </b-input-group>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col cols="12" md="4" class="d-flex align-items-center">
                    <button class='btn plain-btn text-regular'>
                      <i class="fa fa-pencil mr-2 text-primary" style="font-size: 14px"></i> Edit Expense
                    </button>
                    <button class='btn plain-btn text-regular'>
                      <i class="fa fa-trash mr-2 text-danger" style="font-size: 14px"></i> Delete
                    </button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-container>
        </b-form>
      </b-card>
      <barchart v-if="cashflow.length"
                  :dataArray="cashflow"
        ></barchart>
    </section>
    <section class="text-left">
      <b-container fluid class="px-0">
        <h2>Data Table</h2>
        <b-row class="justify-content-end">
          <b-col md="4">
            <b-form-group horizontal label="Filter:" :label-cols="2" label-size="sm">
              <b-form-input v-model="filter" size="sm" placeholder="Type to Search" />
            </b-form-group>
          </b-col>
        </b-row>
        <div class="table-container text-regular">
          <b-table show-empty
                  stacked="md"
                  :items="expenses_amounts"
                  :fields="fields"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :filter="filter"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  @filtered="onFiltered"
                  hover
                  striped
          >
            <template slot="amount" slot-scope="data">
              {{data.item.amount}} SEK
            </template>
            <template slot="actions" slot-scope="row">
              <button class='btn plain-btn text-regular'>
                <i class="fa fa-pencil mr-2 text-primary"></i> Edit
              </button>
              <button class='btn plain-btn text-regular'>
                <i class="fa fa-times mr-2 text-danger"></i> Delete
              </button>
            </template>
          </b-table>
          <div class="d-flex  flex-column flex-md-row justify-content-between">
            <div class="d-flex">
              <div v-if="totalRows > 0" class="d-flex align-items-center">
                <span class="text-gray">Showing {{(currentPage - 1) * perPage + 1}} to {{endRecord}} of {{totalRows}}</span>
              </div>
              <div v-if="totalRows > 0" class="space-divider"></div>
              <div class="d-flex align-items-center">
                <span> show per page: </span>
                <b-form-select :options="pageOptions" v-model="perPage" class="selectPerPage" />
              </div>
            </div>
            <div class="d-flex align-items-center">
              <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0"/>
            </div>
          </div>
        </div>
      </b-container>
    </section>

  </div>
</template>

<script>
import axios from 'axios'
import barchart from '../charts/barchart'

export default {
  name: 'expense',
  async mounted () {
    try {
      let response = await axios.get('https://api.livsplan.se/api/v1/expenses')
      this.expenses = response.data.data
      for (let item of this.expenses) {
        let response = await axios.get(`https://api.livsplan.se/api/v1/expenses/${item.id}`)
        this.expenses_amounts = [...this.expenses_amounts, ...response.data.data.expense_amounts]
      }
      let cashflow = await axios.get('/static/tempdata/data.json')
      this.cashflow = this.processCashflow(cashflow.data)
    } catch (err) {
      console.log(err)
    }
  },
  data () {
    return {
      items: [{
        text: 'Assumptions',
        to: { name: 'assumptions' }
      }, {
        text: 'Expense',
        active: true
      }],
      expenses: [],
      expenses_amounts: [],
      cashflow: [],
      start_year: null,
      end_year: null,
      amount_per_month: 0,
      period: 'perMonth',
      annual_growth_rate: null,
      inflation: null,
      periodOptions: [
        { value: null, text: 'Please select an option', disabled: true },
        { value: 'perMonth', text: 'Per Month' }
      ],
      fields: [
        { key: 'year', label: 'Year', sortable: true, sortDirection: 'desc' },
        { key: 'amount', label: 'Amount', sortable: true },
        { key: 'actions', 'class': 'text-right' }
      ],
      currentPage: 1,
      perPage: 10,
      filter: null,
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      pageOptions: [ 5, 10, 15, 25 ],
      totalRows: 0
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
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    processCashflow (data) {
      let d = []
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (+data[key] >= 0) {
            d.push({
              year: +key,
              value: +data[key]
            })
          }
        }
      }
      return d
    }
  },
  components: {
    barchart
  }

}
</script>

<style lang="scss">
  .expense {
    padding: 120px 34px;

    section {
      margin-bottom: 120px;
    }

    .card span {
      font-size: 14px;
      line-height: 20px;
    }

    h2 {
      font-weight: 600;
      color: #434343;
    }

    .car-icon {
      color: #A5ADBA;
      width: 23px;
      height: 19px;
    }

    .plain-btn {
      background-color:transparent;
      font-size: 12px;
      line-height: 24px;
    }

    .date-spacer {
      min-width: 20px;
      align-self: center;
      text-align: center;
    }

    .space-divider {
      background-color: #C8C8C8;
      height: 60%;
      width: 1px;
      margin: auto 24px;
    }

    .table-container {
      margin-top: 20px;
      font-size: 14px;

      table {
        th {
          padding-top: 18px;
          padding-bottom: 18px;
          background: white;
          box-shadow: 9px 8px 16px 0 rgba(0,0,0,0.07);
          outline: none;
        }

        tbody {
          tr {
            border-bottom-style: dotted;
            border-bottom-width: 2px;
            border-bottom-color: #CACACA;

            &:nth-of-type(odd) {
              background-color: #F1F2F8 !important;
            }

            &:hover {
              background: #FAFBFC !important;
            }

            td {
              vertical-align: middle;
              padding-top: 6px;
              padding-bottom: 6px;
            }
          }

        }
      }

      ul[aria-label="Pagination"] {
        .page-link {
          background: transparent;
          width: 30px;
          height: 30px;
          font-size: 13px;
          line-height: 13px;
          border: none;
          color: #4A4A4A;

        }

        .page-item.active .page-link {
          border-radius: 50%;
          background: #525670;
          color: white;
        }
      }

      .selectPerPage {
        width: 60px;
        background-color: transparent;
        border: none;
      }
    }

  }
</style>
