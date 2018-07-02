<template>
  <div class="expense bg-light">
    <b-breadcrumb :items="items" class="p-0"/>
    <div class="d-flex justify-content-between align-items-center">
      <h1 class="text-regular text-left">{{expense.name}} </h1>
      <button class='btn btn-sm icon-btn text-regular'>
        <i class="flaticon stroke trash-2 text-danger"></i>
        Delete Expense
      </button>
    </div>
    <section class="chart-container depth-2">
      <barchart v-if="cashflow.length" :dataArray="cashflow" :startYear="2018" :endYear="2036"></barchart>
    </section>
    <b-card no-body class="expense-tabs-card depth-1">
      <b-tabs pills card>
        <b-tab title="Auto Calculation" :title-link-class="'expense-tab'" active>
           <b-alert :show="dismissCountDown"
                  dismissible
                  variant="success"
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged">
            New values have been saved successfully!
          </b-alert>
          <b-form id="autoCalcForm" ref="autoCalcForm" @change="autoCalcformChanged" novalidate :validated="validated" @submit="onAutoCalcSumbit">
            <b-container fluid>
              <b-row class="text-left mx-auto">
                <b-col lg="2">
                  <span class="text-regular">Period (start - end year) (?)</span>
                  <div class="d-flex element-spacer">
                    <b-form-group label-for="startYearInput" aria-describedby="invalidStartYearFeedback" :state="startYearState">
                      <b-form-input id="startYearInput" required v-model="expense.start_year" type="number" size="sm" v-b-tooltip.hover.bottom title="The year when this expense first occurs." class="text-regular start_end_year start_year" style="width: 70px" placeholder="Start year" min="2000" max="2140"></b-form-input>
                      <b-form-invalid-feedback id="invalidStartYearFeedback">
                        This is a required field and must be between 2000 and 2140
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <span class="date-spacer">-</span>
                    <b-form-group label-for="endYearInput" aria-describedby="invalidEndYearFeedback" :state="endYearState">
                      <b-form-input id="endYearInput" required v-model="expense.end_year" type="number" size="sm" v-b-tooltip.hover.bottom title="The year when this expense stops occuring." class="text-regular start_end_year end_year" style="width: 70px" placeholder="End year" min="2000" max="2140"></b-form-input>
                      <b-form-invalid-feedback id="invalidEndYearFeedback">
                        This is a required field and must be between 2000 and 2140
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </div>
                </b-col>
                <b-col lg="5">
                  <span class="text-regular">Amount Per Month (?)</span>
                  <div class="d-flex">
                    <vue-numeric currency="SEK" currency-symbol-position="suffix" thousand-separator=" " v-b-tooltip.hover.bottom title="The amount per period." v-model="expense.initial_amount" class="form-control form-control-sm element-spacer text-regular amount-per-month" :min="0"></vue-numeric>
                    <b-input-group size="sm" class="element-spacer">
                      <b-form-input v-model="expense.initial_amount" min="0" max="10000" class="slider" type="range"></b-form-input>
                    </b-input-group>
                  </div>
                </b-col>
                <b-col lg="5">
                  <span class="text-regular">Annual Growth Rate (?)</span>
                  <div class="d-flex">
                    <vue-numeric currency="%" currency-symbol-position="suffix" v-model="expense.annual_increase_percentage" v-b-tooltip.hover.bottom title="The expense grows with this percentage per year." class="form-control form-control-sm element-spacer text-regular annual-growth-rate" :min="0" :max="20"></vue-numeric>
                    <b-input-group size="sm" class="element-spacer">
                      <b-form-input v-model="expense.annual_increase_percentage" min="0" max="20" class="slider" type="range"></b-form-input>
                    </b-input-group>
                  </div>
                </b-col>
              </b-row>
            </b-container>
            <b-button type="submit" :size="'sm'" variant="primary" class="save-calc-btn" :disabled="isCalcSaveDisabled"  v-b-tooltip.hover.bottom title="You can save any changes for this expense by clicking here.">
              <i class="flaticon stroke checkmark"></i>Save New Values
            </b-button>
          </b-form>
        </b-tab>
        <b-tab title="Custom Values" :title-link-class="'expense-tab'">
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
                <button class='btn btn-sm icon-btn text-regular' style="border-color: #eaecef;">
                  <i class="flaticon stroke trash-2 text-danger"></i>
                  Upload Files
                </button>
              </template>
              <template slot="top-row" slot-scope="data">
                <td colspan="3"><b-form-input v-model="filter" size="sm" placeholder="Type to Search" /></td>
              </template>
              <template slot="amount" slot-scope="data">
                {{data.item.amount.toLocaleString('sv-SE')}} SEK
              </template>
              <template slot="actions" slot-scope="row">
                <button class='btn plain-btn text-regular'>
                  <i class="flaticon solid edit-3 text-primary"></i> Edit
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
    <b-card class="depth-1 edit-info-card">
      <b-container fluid>
        <b-row class="text-left">
          <b-col md="9" xl="7">
            <b-row>
              <b-col lg="6" class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <i class="flaticon solid car-1 car-icon"></i>
                  <div class="d-flex flex-column ml-3">
                    <span class="text-gray">Name</span>
                    <span class="text-regular font-weigth-medium">{{expense.name}}</span>
                  </div>
                </div>

                <div class="d-flex flex-column">
                  <span class="text-gray">Category</span>
                  <span class="text-regular font-weigth-medium" v-if="expense.category">{{expense.category.name}}</span>
                </div>

                <div class="d-flex flex-column">
                  <span class="text-gray">Typ / Subtype</span>
                  <span class="text-regular font-weigth-medium" v-if="expense.expense_type">{{expense.expense_type.name}} :: {{expense.expense_subtype.name}}</span>
                </div>
              </b-col>
              <b-col lg="6" class="d-flex align-items-center justify-content-between">
                <div class="d-flex flex-column ml-lg-3">
                  <span class="text-gray">Inflation</span>
                  <span class="text-regular font-weigth-medium">{{expense.inflation_rate}} %</span>
                </div>

                <div class="d-flex flex-column">
                  <span class="text-gray">Period</span>
                  <span class="text-regular font-weigth-medium">{{expense.initial_amount_period}}</span>
                </div>

                <div class="d-flex flex-column">
                  <span class="text-gray">Person</span>
                  <span class="text-regular font-weigth-medium">Job Bolmeson (me)</span>
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
                <i class="flaticon solid edit-3 text-primary"></i>
                Edit Info
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
            <b-input-group append="%">
              <b-form-input v-model="expense.annual_increase_percentage" type="number"></b-form-input>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="my-3">
          <b-col sm="3" class="d-flex align-items-center justify-content-end"><label :for="'tax-input'">Tax</label></b-col>
          <b-col sm="9">
            <b-input-group append="%">
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
        <h1>Edit: "Food Expenses"</h1>
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
      let response = await axios.get(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`)
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
        text: 'Expenses',
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
        { key: 'actions', 'class': 'd-flex justify-content-end' }
      ],
      currentPage: 1,
      perPage: 10,
      filter: null,
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      pageOptions: [ 5, 10, 15, 25 ],
      totalRows: 0,
      modalShow: false,
      isCalcSaveDisabled: true,
      validated: false,
      dismissCountDown: 0
    }
  },
  computed: {
    endRecord () {
      if (this.perPage * this.currentPage < this.totalRows) {
        return this.perPage * this.currentPage
      } else {
        return this.totalRows
      }
    },
    startYearState () {
      return !this.validated || (parseInt(this.expense.start_year) > 1999 && parseInt(this.expense.start_year) < 2141)
    },
    endYearState () {
      return !this.validated || (parseInt(this.expense.start_year) > 1999 && parseInt(this.expense.start_year) < 2141)
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
    },
    autoCalcformChanged  (ev) {
      this.isCalcSaveDisabled = false
    },
    async onAutoCalcSumbit (ev) {
      ev.preventDefault()
      this.validated = true
      if (this.$refs.autoCalcForm.checkValidity() === true) {
        try {
          let data = {
            start_year: this.expense.start_year,
            end_year: this.expense.end_year,
            initial_amount: this.expense.initial_amount,
            annual_increase_percentage: this.expense.annual_increase_percentage
          }
          await axios.put(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`, data)
          this.validated = false
          this.dismissCountDown = 5
        } catch (err) {
          console.log(err)
          this.validated = false
        }
      }
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
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
      margin-top: 6px;
    }

    .date-spacer {
      min-width: 20px;
      margin-top: 10px;
      text-align: center;
    }

    .space-divider {
      background-color: #C8C8C8;
      height: 60%;
      width: 1px;
      margin: auto 24px;
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

    // chart wrapper
    .chart-container {
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 49.5vw);
      margin-top: 38px;
    }

    // customize card
    .card {
      border-radius: 0;
      span {
        font-size: 14px;
        line-height: 20px;
      }
      &.expense-tabs-card {
        margin-top: -170px;

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

        .tab-content {
          padding-top: 28px;
          background: linear-gradient(0deg, #FFFFFF 0%, #F8F8F8 100%);

          .card-body {
            padding: 0px 0px 28px 0px;

            form {

              .start_end_year
              {
                text-align:center;
              }
              .amount-per-month {
                width: 130px;
                margin-right: 20px;
                text-align:right;
              }
              .annual-growth-rate {
                width: 54px;
                margin-right: 20px;
                text-align:right;
              }

              .save-calc-btn {
                position: absolute;
                right: 30px;
                top: 42px;
                border-radius: 40px;
                font-weight: 500;
                display: flex;
                i {
                  font-size: 1rem;
                  margin-right: 0.5rem;
                }
              }
            }
          }

        }
      }

      &.edit-info-card {
        margin-top: 34px;
        margin-bottom: 120px;

        .card-body {
          padding: 30px 15px 33px;
        }
      }
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
        border-bottom: none;
        box-shadow: 0px 24px 1px -24px #232B36;
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
      background: #C1C7D0;
      outline: none;
      height: 1px !important;
      padding: 0;
      margin-top: 23px;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      background: url('../../assets/img/slider.png');
      border-radius: 50%;
      cursor: pointer;
      background-color: #FFFFFF;
      height: 16px;
      width: 16px;
      background-size: 16px;
    }

    .slider::-moz-range-thumb {
      background: url('../../assets/img/slider.png');
      border-radius: 50%;
      cursor: pointer;
      background-color: #FFFFFF;
      height: 16px;
      width: 16px;
      background-size: 16px;
    }

    .slider::-ms-thumb {
      background: url('../../assets/img/slider.png');
      border-radius: 50%;
      cursor: pointer;
      background-color: #FFFFFF;
      height: 16px;
      width: 16px;
      background-size: 16px;
    }

    .slider:focus::-ms-fill-lower {
      background: #888;
    }
    .slider:focus::-ms-fill-upper {
      background: #ccc;
    }

  }
</style>
