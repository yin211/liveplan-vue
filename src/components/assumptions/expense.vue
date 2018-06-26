<template>
  <div class="expense bg-light">
    <b-breadcrumb :items="items" class="p-0"/>
    <b-container fluid class="px-0 text-left">
      <h1 class="text-regular">{{expense.name}}</h1>
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
                <b-row class="no-gutters">
                  <b-col sm="4" class="d-flex">
                    <div class="d-flex align-items-center">
                      <i class="fa fa-car car-icon"></i>
                      <div class="d-flex flex-column ml-3">
                        <span class="text-gray">Category</span>
                        <span class="text-regular">Car</span>
                      </div>
                    </div>
                    <div class="rect-spacer d-none d-lg-block" style="margin: -24px 0 -20px 30px;"></div>
                  </b-col>
                  <b-col sm="4">
                    <span class="text-regular">Start - End Year</span>
                    <div class="d-flex element-spacer">
                      <b-form-input v-model="expense.start_year" type="number" size="sm"></b-form-input>
                      <span class="date-spacer">-</span>
                      <b-form-input v-model="expense.end_year" type="number" size="sm"></b-form-input>
                    </div>
                  </b-col>
                  <b-col sm="4" class="pl-sm-4">
                    <span class="text-regular">Amount Per Month</span>
                    <b-input-group size="sm" append="SEK" class="element-spacer">
                      <b-form-input v-model="expense.initial_amount" type="number"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
              </b-col>
              <b-col lg="7">
                <b-row>
                  <b-col cols="12" md="8">
                    <b-row>
                      <b-col sm="5" class="d-flex">
                        <div class="rect-spacer d-none d-lg-block" style="margin: -24px 0px -20px 0px;"></div>
                        <div class="d-flex flex-column">
                          <span class="text-regular">Period</span>
                          <b-form-select v-model="expense.initial_amount_period" :options="periodOptions" size="sm" class="element-spacer"/>
                        </div>
                      </b-col>
                      <b-col sm="4">
                        <span class="text-regular">Annual Growth Rate</span>
                        <b-input-group size="sm" append="%" class="w-75 element-spacer">
                          <b-form-input v-model="expense.annual_increase_percentage" type="number"></b-form-input>
                        </b-input-group>
                      </b-col>
                      <b-col sm="3">
                        <span class="text-regular">Inflation</span>
                        <b-input-group size="sm" append="%" class="element-spacer">
                          <b-form-input v-model="expense.inflation_rate" type="number"></b-form-input>
                        </b-input-group>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col cols="12" md="4" class="d-flex">
                    <div class="rect-spacer d-none d-lg-block" style="margin: -24px 0px -20px 0px;"></div>
                    <button class='btn plain-btn text-regular'>
                      <i class="fa fa-pencil mr-2 text-primary" style="font-size: 14px"></i> Edit
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
    </section>
    <section class="chart-container depth-3">
      <barchart v-if="cashflow.length"
                  :dataArray="cashflow"
      ></barchart>
    </section>
    <section class="text-left">
      <b-container fluid class="px-0">
        <h2>Data Table</h2>
        <div class="table-container text-regular">
          <b-table show-empty
                  stacked="md"
                  :items="expense.expense_amounts"
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
            <template slot="top-row" slot-scope="data">
              <td colspan="3"><b-form-input v-model="filter" size="sm" placeholder="Type to Search" /></td>
            </template>
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
      let response = await axios.get(`https://api.livsplan.se/api/v1/expenses/${this.$route.params.id}`)
      this.expense = response.data.data
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
      expense: {},
      cashflow: [],
      periodOptions: [
        { value: null, text: 'Please select an option', disabled: true },
        { value: 'month', text: 'Per Month' }
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
      totalRows: 0,
      isEdit: false
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

    .element-spacer {
      margin-top: 8px;
    }

    .rect-spacer {
      width: 50px;
      background: linear-gradient(270deg, #FFFFFF 0%, #F8F8F8 100%);
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

    .breadcrumb {
      background: transparent;
    }

    .card-body {
      padding: 24px 20px 20px;
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

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        /* display: none; <- Crashes Chrome on hover */
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }


    .chart-container {
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      margin-top: -180px;
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

            &.b-table-top-row {
              border: none;
              td {
                width: 100%;
                padding: 0;
                input {
                  border: none;
                }
              }
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
