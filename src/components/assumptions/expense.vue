<template>
  <div class="expense bg-light">
    <notify-me
      close="bootstrap"
      :event-bus="bus"
    >
      <template slot="content" slot-scope="{data}">
          <div>
              <h4><b>{{data.title}}</b></h4>
              <p style="margin: 0">{{data.text}}</p>
          </div>
      </template>
    </notify-me>
    <b-breadcrumb :items="items" class="p-0"/>
    <div class="d-flex justify-content-between align-items-center">
      <h1 class="text-regular text-left">{{expense.name}} </h1>
      <button class='btn btn-sm icon-btn text-regular'>
        <i class="flaticon stroke trash-2 text-danger"></i>
        Delete Expense
      </button>
    </div>
    <section class="chart-container depth-2">
      <barchart v-if="cashflow.length" :dataArray="cashflow" :startYear="2018" :endYear="2036" :birthYear="1981"></barchart>
    </section>
    <b-card no-body class="expense-tabs-card depth-1">
      <b-tabs pills card>
        <b-tab title="Auto Calculation" :title-link-class="'expense-tab'" active>
          <b-form id="autoCalcForm" ref="autoCalcForm" @change="autoCalcformChanged" novalidate :validated="autoCalcValidated" @submit.prevent="onAutoCalcSumbit">
            <b-container fluid>
              <b-row class="text-left mx-auto">
                <b-col lg="2">
                  <span class="text-regular">Period (start - end year) (?)</span>
                  <div class="d-flex element-spacer">
                    <b-form-group label-for="startYearInput" aria-describedby="invalidStartYearFeedback" :state="startYearState">
                      <b-form-input id="startYearInput" required v-model="expense.start_year" type="number" size="sm" v-b-tooltip.hover.bottom title="The year when this expense first occurs." class="text-regular start_end_year start_year" style="width: 86px" placeholder="Start year" min="2000" max="2140"></b-form-input>
                      <b-form-invalid-feedback id="invalidStartYearFeedback">
                        This is a required field and must be between 2000 and 2140
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <span class="date-spacer">-</span>
                    <b-form-group label-for="endYearInput" aria-describedby="invalidEndYearFeedback" :state="endYearState">
                      <b-form-input id="endYearInput" required v-model="expense.end_year" type="number" size="sm" v-b-tooltip.hover.bottom title="The year when this expense stops occuring." class="text-regular start_end_year end_year" style="width: 86px" placeholder="End year" min="2000" max="2140"></b-form-input>
                      <b-form-invalid-feedback id="invalidEndYearFeedback">
                        This is a required field and must be between 2000 and 2140
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </div>
                </b-col>
                <b-col lg="5">
                  <span class="text-regular">Amount Per Month (?)</span>
                  <div class="d-flex">
                    <vue-numeric currency="SEK" currency-symbol-position="suffix" thousand-separator=" " v-b-tooltip.hover.bottom title="The amount per period." v-model="expense.amount" class="form-control form-control-sm element-spacer text-regular amount-per-month" :min="0"></vue-numeric>
                    <b-input-group size="sm" class="element-spacer">
                      <b-form-input v-model="expense.amount" min="0" max="10000" class="slider" type="range"></b-form-input>
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
              <i class="fa fa-spinner fa-spin" v-if="isSaving" style="margin-top: 2px" ></i>
              <i class="flaticon stroke checkmark" v-else></i>
              Save New Values
            </b-button>
          </b-form>
        </b-tab>
        <b-tab title="Custom Values" :title-link-class="'expense-tab'">
          <button class='btn btn-sm icon-btn text-regular upload-file-btn' :disabled="customDisabled">
            <i class="flaticon stroke upload text-primary"></i>
            Upload Files
          </button>
          <div class="custom-values-bar">
            <div class="d-flex justify-content-between align-items-center" :class="[customDisabled ? 'bar-disable-color' :'bar-enable-color']">
              <div class="d-flex align-items-center">
                <span class="mr-3" :class="{ 'font-weight-bold': !customDisabled }">Enable</span>
                <switches v-model="customDisabled" theme="bootstrap" type-bold="true" color="success"></switches>
                <span class="ml-3" :class="{ 'font-weight-bold': customDisabled }">Disable</span>
              </div>
              <span v-if="customDisabled" class="text-gray">
                Enabling "Custom Values" will disable "Auto Calculation". You can choose one of the two.
              </span>
              <span v-else class="text-gray">
                Enabling "Auto Calculation" will disable "Custom Values". You need to choose one of the two.
              </span>
            </div>
          </div>
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
                {{data.item.amount.toLocaleString('sv-SE')}} SEK
              </template>
              <template slot="actions" slot-scope="row">
                <button class='btn plain-btn text-regular' :disabled="customDisabled">
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
                  <span class="text-regular font-weigth-medium">{{expense.amount_recurrence}}</span>
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
              <button class='btn btn-sm icon-btn text-regular' style="border-color: #eaecef;" @click="openEditModal">
                <i class="flaticon solid edit-3 text-primary"></i>
                Edit Info
              </button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
    <b-modal id="edit-info-modal" size="lg" v-model="modalShow" hide-footer>
      <div slot="modal-header" class="w-100 mx-auto">
        <h1>Edit: {{expense.name}}</h1>
        <button type="button" class="close" aria-label="Close" @click="closeEditModal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <b-form id="editInfoForm" ref="editInfoForm" novalidate :validated="editInfoValidated" @submit.prevent="onEditInfoSumbit">
        <b-container style="width: 60%">
          <b-row>
            <b-col sm="3" class="d-flex justify-content-end mt-3"><label :for="'nameInput'">Name</label></b-col>
            <b-col sm="9">
              <b-form-group label-for="nameInput" :state="nameState" class="text-left">
                <b-form-input id="nameInput"  v-model="editExpense.name" :state="nameState" aria-describedby="nameInputFeedback" required></b-form-input>
                <b-form-invalid-feedback id="nameInputFeedback">
                    Name is required and minium length is 2
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'subtype-select'">Subtype</label></b-col>
            <b-col sm="9">
              <b-form-group label-for="subtype-select" class="text-left">
                <b-form-select v-model="editExpense.expense_subtype_id" :id="'subtype-select'" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'period-select'">Period</label></b-col>
            <b-col sm="9">
              <b-form-group label-for="period-select" :state="periodState" class="text-left">
                <b-form-select :options="periodOptions" v-model="editExpense.amount_recurrence" :id="'period-select'" :state="periodState" aria-describedby="periodSelectFeedback" required/>
                <b-form-invalid-feedback id="periodSelectFeedback">
                    This field is required
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'category-select'">Category</label></b-col>
            <b-col sm="9">
              <b-form-group label-for="category-select" :state="categoryState" class="text-left">
                <b-form-select :options="categoryOptions" v-model="editExpense.category_id" :id="'category-select'" :state="categoryState" aria-describedby="categorySelectFeedback" required/>
                <b-form-invalid-feedback id="categorySelectFeedback">
                    This field is required
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'person-select'">Person</label></b-col>
            <b-col sm="9">
              <b-form-group label-for="person-select" :state="personState" class="text-left">
                <b-form-select :options="personOptions" v-model="editExpense.person_id" :id="'person-select'" :state="personState" aria-describedby="personSelectFeedback" required/>
                <b-form-invalid-feedback id="personSelectFeedback">
                    This field is required
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'inflation-input'">Inflation</label></b-col>
            <b-col sm="9">
              <vue-numeric currency="%" currency-symbol-position="suffix" v-model="editExpense.inflation_rate" class="form-control text-regular mb-3" :min="0" :max="10"></vue-numeric>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'tax-input'">Tax</label></b-col>
            <b-col sm="9">
              <vue-numeric currency="%" currency-symbol-position="suffix" v-model="editExpense.tax" class="form-control text-regular mb-3" :min="0" :max="30"></vue-numeric>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="d-flex mt-3 justify-content-end" style="white-space: nowrap;"><label :for="'timeline-icon-select'">Timeline Icon</label></b-col>
            <b-col sm="9">
              <b-form-group label-for="timeline-icon-select" class="text-left">
                <b-form-select :id="'timeline-icon-select'" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'currency-select'">Currency</label></b-col>
            <b-col sm="9">
              <b-form-group label-for="currency-select" class="text-left">
                <b-form-select :options="currencyOptions" v-model="editExpense.currency_id" :id="'currency-select'" />
              </b-form-group>
            </b-col>
          </b-row>
          <div class="w-100 mx-auto">
            <b-btn type="submit" size="lg" variant="primary">
              Save
            </b-btn>
          </div>
        </b-container>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import barchart from '../charts/barchart'
import Notify from 'vue-notify-me'
import Switches from 'vue-switches'
import Vue from 'vue'
const bus = new Vue()

export default {
  name: 'expense',
  async mounted () {
    try {
      let response = await axios.get(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`)
      this.expense = response.data.data
      if (this.expense.calculation_mode === 'auto') {
        this.customDisabled = true
      } else {
        this.customDisabled = false
      }
      let cashflow = await axios.get('/static/tempdata/data.json')
      this.cashflow = this.processCashflow(cashflow.data)
      response = await axios.get(`${process.env.ROOT_API}/categories`)
      for (let item of response.data.data) {
        this.categoryOptions.push({value: item.id, text: item.name})
      }
    } catch (err) {
      console.log(err)
    }
  },
  data () {
    return {
      bus,
      items: [{
        text: 'Assumptions',
        to: { name: 'assumptions' }
      }, {
        text: 'Expenses',
        active: true
      }],
      expense: {},
      editExpense: {},
      cashflow: [],
      periodOptions: [
        { value: null, text: 'Please select an option', disabled: true },
        { value: 'month', text: 'Monthly' },
        { value: 'daily', text: 'Daily' },
        { value: 'weekly', text: 'Weekly' },
        { value: 'quarterly', text: 'Quarterly' },
        { value: 'semiannually', text: 'Semiannually' },
        { value: 'annually', text: 'Annually' },
        { value: 'onetime', text: 'One time' }
      ],
      categoryOptions: [
        { value: null, text: 'Please select an option', disabled: true }
      ],
      personOptions: [
        { value: null, text: 'Please select an option', disabled: true },
        { value: '1', text: 'Jan Bolmeson' },
        { value: '2', text: 'Caroline Bolmeson' }
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
      autoCalcValidated: false,
      editInfoValidated: false,
      isSaving: false,
      customDisabled: false
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
      return !this.autoCalcValidated || (parseInt(this.expense.start_year) > 1999 && parseInt(this.expense.start_year) < 2141)
    },
    endYearState () {
      return !this.autoCalcValidated || (parseInt(this.expense.start_year) > 1999 && parseInt(this.expense.start_year) < 2141)
    },
    nameState () {
      if (!this.editInfoValidated) {
        return null
      } else {
        return this.editExpense.name && this.editExpense.name.length > 1
      }
    },
    periodState () {
      if (!this.editInfoValidated) {
        return null
      } else {
        return this.editExpense.amount_recurrence != null
      }
    },
    categoryState () {
      if (!this.editInfoValidated) {
        return null
      } else {
        return this.editExpense.category_id != null
      }
    },
    personState () {
      if (!this.editInfoValidated) {
        return null
      } else {
        return this.editExpense.person_id != null
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
    },
    autoCalcformChanged  (ev) {
      this.isCalcSaveDisabled = false
    },
    async onAutoCalcSumbit (ev) {
      this.autoCalcValidated = true
      if (this.$refs.autoCalcForm.checkValidity() === true) {
        this.isCalcSaveDisabled = true
        this.autoCalcValidated = false
        this.isSaving = true
        this.$root.$emit('bv::hide::tooltip')
        try {
          let data = {
            start_year: this.expense.start_year,
            end_year: this.expense.end_year,
            amount: this.expense.amount,
            annual_increase_percentage: this.expense.annual_increase_percentage
          }
          await axios.put(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`, data)
          this.isSaving = false
          this.bus.$emit('notify-me', {
            data: {
              title: 'Success!',
              text: 'New vaules have been saved successfully!'
            }
          })
        } catch (err) {
          console.log(err)
          this.isSaving = false
          this.bus.$emit('notify-me', {
            data: {
              title: 'Failed!',
              text: 'Something went wrong!'
            },
            status: 'is-danger'
          })
        }
      }
    },
    openEditModal () {
      this.autoCalcValidated = false
      this.editInfoValidated = false
      this.modalShow = true
      this.editExpense = JSON.parse(JSON.stringify(this.expense))
    },
    closeEditModal () {
      this.modalShow = false
      this.editExpense = {}
    },
    async onEditInfoSumbit (ev) {
      this.editInfoValidated = true
      if (this.$refs.editInfoForm.checkValidity() === true) {
        try {
          let data = {
            name: this.editExpense.name,
            amount_recurrence: this.editExpense.amount_recurrence,
            category_id: this.editExpense.category_id,
            person_id: this.editExpense.person_id,
            expense_subtype_id: this.editExpense.expense_subtype_id,
            inflation_rate: this.editExpense.inflation_rate
          }
          await axios.put(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`, data)
          this.bus.$emit('notify-me', {
            data: {
              title: 'Success!',
              text: 'New vaules have been saved successfully!'
            }
          })
          this.modalShow = false
          let response = await axios.get(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`)
          this.expense = response.data.data
        } catch (err) {
          console.log(err)
          this.bus.$emit('notify-me', {
            data: {
              title: 'Failed!',
              text: 'Something went wrong!'
            },
            status: 'is-danger'
          })
        }
      }
    }
  },
  watch: {
    customDisabled: async function (val) {
      let modeChanged = false
      if (val && this.expense.calculation_mode === 'custom') {
        modeChanged = true
      } else if (!val && this.expense.calculation_mode === 'auto') {
        modeChanged = true
      }

      if (modeChanged) {
        let data = {
          calculation_mode: val ? 'auto' : 'custom'
        }
        await axios.put(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`, data)
        this.bus.$emit('notify-me', {
          data: {
            title: 'Success!',
            text: 'Calculation mode has been updated successfully!'
          }
        })
      }
    }
  },
  components: {
    barchart,
    'notify-me': Notify,
    Switches
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
            outline: none;

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

            .upload-file-btn {
              position: absolute;
              right: 30px;
              top: 42px;
              border-color: #eaecef;
            }

            .custom-values-bar {
              position: absolute;
              top: 80px;
              width: 100%;
              background-color: white;
              padding: 10px 0;
              & > div {
                padding: 0px 20px;
                margin: 0px 10px;
                padding: 0 20px;
                &.bar-disable-color {
                  background-color: #F8F8F8;
                  border: 1px dashed #D8D8D8;
                }
                &.bar-enable-color {
                  background-color: rgba(54,179,126,0.1);
                  border: 1px dashed #36B37E;
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
      padding: 30px 20px;
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
        form {
          .btn {
            width: 204px;
            border-radius: 40px;
            font-size: 14px;
            font-weight: 600;
            padding: .75rem 1rem;
            margin: 64px auto;
          }
          .invalid-feedback {
            position: absolute;
          }

          .row {
            margin-top: 0.5rem;
          }
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

    // customize notification
    .notification {
      padding: 1.25rem 1.5rem;
      color: #fff;

      &.is-success {
        background-color: #23d160;
      }

      &.is-danger {
        background-color: #ff3860;
      }

      .close {
        position: absolute;
        right: .5em;
        top: .5em;
      }
    }

    // customize switch toggle button
    .vue-switcher-theme--bootstrap {
      input {
        position: relative;
      }
      &.vue-switcher-color--success {
        div {
            background-color: #EF5350;
            width: 40px;
            height: 22px;

            &:after {
                // for the circle on the switch
                background-color: white;
                height: 16px;
                width: 16px;
                top: 3px;
                margin-left: -20px;
            }
        }

        &.vue-switcher--unchecked {
            div {
                background-color: #36b37E;

                &:after {
                  background-color: white;
                  margin-left: -25px;
                }
            }
        }
      }
    }

  }
</style>
