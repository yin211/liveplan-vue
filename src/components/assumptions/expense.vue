<template>
  <div class="expense bg-light">
    <b-breadcrumb :items="items" class="p-0"/>
    <div class="d-flex justify-content-between align-items-center">
      <h1 class="text-regular text-left">{{expense.name}}</h1>
      <button class='btn btn-sm icon-btn text-regular'>
        <i class="fa fa-trash mr-2 text-danger"></i> Delete Expense
      </button>
    </div>
    <section class="chart-container depth-2">
      <barchart v-if="cashflow.length" :dataArray="cashflow"></barchart>
    </section>
    <b-card no-body class="expense-tabs-card depth-1" style="margin-top: -170px">
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
                      <b-form-input v-model="expense.initial_amount" min="1" max="10000" class="slider" type="range"></b-form-input>
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
                      <b-form-input v-model="expense.annual_increase_percentage" min="1" max="100" class="slider" type="range"></b-form-input>
                    </b-input-group>
                  </div>
                </b-col>
              </b-row>
            </b-container>
            <b-button :size="'sm'" variant="primary" class="save-calc-btn">
              <i class="fa fa-check mr-2"></i>Save New Values
            </b-button>
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
              <template slot="HEAD_actions" slot-scope="data">
                <button class='btn btn-sm text-regular upload-btn'>
                  <i class="fa fa-trash mr-2 text-danger"></i> Upload File
                </button>
              </template>
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
                <!-- <button class='btn plain-btn text-regular'>
                  <i class="fa fa-check mr-2 text-success"></i> Save
                </button>
                <button class='btn plain-btn text-regular'>
                  <i class="fa fa-times mr-2 text-danger"></i> Cancel
                </button> -->
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
    <b-card class="depth-1" style="margin-top: 34px; margin-bottom: 120px;">
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
          <b-col md="3" xl="5" class="d-flex justify-content-center  justify-content-md-end align-items-center">
              <button class='btn btn-sm icon-btn text-regular' style="border-color: #eaecef;" @click="modalShow = !modalShow">
                <i class="fa fa-pencil mr-2 text-primary"></i> Edit Info
              </button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
    <b-modal id="edit-info-modal" size="lg" v-model="modalShow">
      <b-container style="width: 60%">
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end"><label :for="'name-input'">Name</label></b-col>
          <b-col sm="9"><b-form-input type="text" :id="'name-input'" v-model="expense.name"></b-form-input></b-col>
        </b-row>
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end"><label :for="'subtype-select'">Subtype</label></b-col>
          <b-col sm="9"><b-form-select v-model="expense.expense_subtype_id" :id="'subtype-select'" /></b-col>
        </b-row>
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end"><label :for="'period-select'">Period</label></b-col>
          <b-col sm="9"><b-form-select :options="periodOptions" v-model="expense.initial_amount_period" :id="'period-select'" /></b-col>
        </b-row>
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end"><label :for="'category-select'">Category</label></b-col>
          <b-col sm="9"><b-form-select :options="categoryOptions" v-model="expense.category_id" :id="'category-select'" /></b-col>
        </b-row>
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end"><label :for="'person-select'">Person</label></b-col>
          <b-col sm="9"><b-form-select :options="personOptions" v-model="expense.person_id" :id="'person-select'" /></b-col>
        </b-row>
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end"><label :for="'inflation-input'">Inflation</label></b-col>
          <b-col sm="9">
            <b-input-group size="sm" append="%">
              <b-form-input v-model="expense.annual_increase_percentage" type="number"></b-form-input>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end"><label :for="'tax-input'">Tax</label></b-col>
          <b-col sm="9">
            <b-input-group size="sm" append="%">
              <b-form-input v-model="expense.tax" type="number"></b-form-input>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end" style="white-space: nowrap;"><label :for="'timeline-icon-select'">Timeline Icon</label></b-col>
          <b-col sm="9"><b-form-select :id="'timeline-icon-select'" /></b-col>
        </b-row>
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end"><label :for="'currency-select'">Currency</label></b-col>
          <b-col sm="9"><b-form-select :options="currencyOptions" v-model="expense.currency_id" :id="'currency-select'" /></b-col>
        </b-row>

      </b-container>
      <div slot="modal-header" class="w-100 mx-auto">
        <h1>Edit</h1>
        <button type="button" class="close" aria-label="Close" @click="modalShow=false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div slot="modal-footer" class="w-100 mx-auto">
        <b-btn size="lg" variant="primary" @click="modalShow=false">
          Save
        </b-btn>
      </div>
    </b-modal>
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
      categoryOptions: [

      ],
      personOptions: [

      ],
      currencyOptions: [
        { value: 'dollar', text: 'Dollar' },
        { value: 'sek', text: 'SEK' }
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
      modalShow: false
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

    // chart wrapper
    .chart-container {
      margin-left: calc(50% - 50vw + 0.5rem);
      margin-right: calc(50% - 50vw + 0.5rem);
      margin-top: 38px;
    }

    // customize tabs
    .expense-tabs-card {
      .card-header {
        padding: 34px 30px;
        background: white;
        border-bottom: none;

        .card-header-pills {
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

          .save-calc-btn {
            position: absolute;
            right: 30px;
            top: 42px;
            border-radius: 40px;
            font-weight: 500;
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

    // customize table
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
          .upload-btn {
            border-radius: 30px;
            border: 1px solid #eaecef;
          }
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

    // customize modal
    #edit-info-modal {
      .modal-header {
        padding: 48px;
        .close {
          font-size: 48px;
          padding: 0;
          position: absolute;
          top: 24px;
          right: 32px;
          outline: none;

          span {
            color: #A5ADBA;
            font-weight: 300;
          }
        }
      }

      .modal-body {
        label {
          color: #232B36;
          font-size: 14px;
          line-height: 20px;
        }
      }

      .modal-footer {
        padding-top: 48px;
        padding-bottom: 80px;
        border-top: none;

        .btn {
          width: 204px;
          border-radius: 40px;
          font-size: 14px;
          font-weight: 600;
          padding: 0.75rem 1rem;
        }
      }
    }

    // customize slider

    .slider {
      -webkit-appearance: none;
      width: 100%;
      background: #979797;
      outline: none;
      height: 2px !important;
      padding: 0;
      border: 1px solid #979797;
      margin-top: 23px;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      background: url('../../assets/img/slider.png');
      cursor: pointer;
      background-color: #FFFFFF;
      height: 16px;
      width: 16px;
      background-size: 16px;
    }

    .slider::-moz-range-thumb {
      background: url('../../assets/img/slider.png');
      cursor: pointer;
      background-color: #FFFFFF;
      height: 16px;
      width: 16px;
      background-size: 16px;
    }

  }
</style>
