<template>
  <div class="expense bg-light">
    <b-breadcrumb :items="items" class="p-0"/>
    <h1 class="text-regular text-left">{{expense.name}}</h1>
    <section class="chart-container depth-2">
      <barchart v-if="cashflow.length" :dataArray="cashflow"></barchart>
    </section>
    <b-card no-body class="expense-tabs-card" style="margin-top: -170px">
      <b-tabs pills card>
        <b-tab title="Auto Calculation" :title-link-class="'expense-tab'" active>
          <div class="tab-padding-top"></div>
          <b-form>
            <b-container fluid>
              <b-row class="text-left mx-auto">
                <b-col lg="2">
                  <span class="text-regular">Start - End Year</span>
                  <div class="d-flex element-spacer">
                    <b-form-input v-model="expense.start_year" type="number" size="sm"></b-form-input>
                    <span class="date-spacer">-</span>
                    <b-form-input v-model="expense.end_year" type="number" size="sm"></b-form-input>
                  </div>
                </b-col>
                <b-col lg="5">
                  <span class="text-regular">Amount Per Month</span>
                  <div class="d-flex">
                    <b-input-group size="sm" append="SEK" class="element-spacer amount-per-month">
                      <b-form-input v-model="expense.initial_amount" type="number"></b-form-input>
                    </b-input-group>
                    <b-input-group size="sm" class="element-spacer">
                      <b-form-input v-model="expense.initial_amount" min="1" max="10000" type="range"></b-form-input>
                    </b-input-group>
                  </div>
                </b-col>
                <b-col lg="5">
                  <span class="text-regular">Annual Growth Rate</span>
                  <div class="d-flex">
                    <b-input-group size="sm" append="%" class="element-spacer annaul-growth-rate">
                      <b-form-input v-model="expense.annual_increase_percentage" type="number"></b-form-input>
                    </b-input-group>
                    <b-input-group size="sm" class="element-spacer">
                      <b-form-input v-model="expense.annual_increase_percentage" min="1" max="100" type="range"></b-form-input>
                    </b-input-group>
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </b-form>
        </b-tab>
        <b-tab title="Custom Values" :title-link-class="'expense-tab'">
          <div class="tab-padding-top"></div>
          <div class="table-container text-regular text-left">
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
        </b-tab>
      </b-tabs>
    </b-card>
    <b-card style="margin-top: 34px; margin-bottom: 240px;">
      <b-container fluid>
        <b-row class="text-left">
          <b-col md="9" xl="7">
            <b-row>
              <b-col lg="6" class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <i class="fa fa-car car-icon"></i>
                  <div class="d-flex flex-column ml-3">
                    <span class="text-gray">Name</span>
                    <span class="text-regular">Car Rental</span>
                  </div>
                </div>

                <div class="d-flex flex-column">
                  <span class="text-gray">Category</span>
                  <span class="text-regular">Assets</span>
                </div>

                <div class="d-flex flex-column">
                  <span class="text-gray">Sub-category</span>
                  <span class="text-regular">Assets</span>
                </div>
              </b-col>
              <b-col lg="6" class="d-flex align-items-center justify-content-between">
                <div class="d-flex flex-column ml-lg-3">
                  <span class="text-gray">Inflation</span>
                  <span class="text-regular">{{expense.inflation_rate}} %</span>
                </div>

                <div class="d-flex flex-column">
                  <span class="text-gray">Period</span>
                  <span class="text-regular">{{expense.initial_amount_period}}</span>
                </div>

                <div class="d-flex flex-column">
                  <span class="text-gray">Person</span>
                  <span class="text-regular">Job Bolmeson (me)</span>
                </div>

                <div class="d-flex flex-column">
                  <span class="text-gray">Tax</span>
                  <span class="text-regular">10%</span>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col md="3" xl="5" class="text-center text-md-right">
              <button class='btn plain-btn text-regular'>
                <i class="fa fa-pencil mr-2 text-primary" style="font-size: 14px"></i> Edit
              </button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
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

    .breadcrumb {
      background: transparent;
      margin-bottom: 24px;
    }

    .chart-container {
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      margin-top: 38px;
    }

    .expense-tabs-card {
      .card-header {
        padding: 34px 30px;
        background: white;
        border-bottom: none;

        .expense-tab {
          font-size: 24px;
          line-height: 32px;
          color: #84888F;
          &.active {
            color: #434343;
            font-weight: 600;
            background-color: transparent;
          }
        }
      }

      .card-body {
        padding: 0px 0px 28px 0px;

        .tab-padding-top {
          height: 28px;
          background: linear-gradient(270deg, #FFFFFF 0%, #F8F8F8 100%);
        }

        form {
          .amount-per-month {
            width: 250px;
            margin-right: 20px;
          }
          .annaul-growth-rate {
            width: 120px;
            margin-right: 20px;
          }
        }
      }

    }

    .element-spacer {
      margin-top: 6px;
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

    .card span {
      font-size: 14px;
      line-height: 20px;
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

    .table-container {
      padding: 0 20px;
      font-size: 14px;

      table {
        th {
          padding-top: 18px;
          padding-bottom: 18px;
          background: white;
          box-shadow: 9px 8px 16px 0 rgba(0,0,0,0.07);
          outline: none;
          border: none;
        }

        tbody {
          tr {
            border-bottom-style: dotted;
            border-bottom-width: 2px;
            border-bottom-color: #CACACA;

            // &:nth-of-type(odd) {
            //   background-color: #F1F2F8 !important;
            // }

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
          font-size: 13px;
          line-height: 13px;
          border: none;
          color: #4A4A4A;
          display: inline;
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
