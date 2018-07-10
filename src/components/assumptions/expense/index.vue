<template>
  <div class="expense bg-light">
    <b-breadcrumb :items="items" class="p-0"/>
    <div class="d-flex justify-content-between align-items-center">
      <h1 class="text-regular text-left">{{expense.name}} </h1>
      <button class='btn btn-sm icon-btn text-regular' @click="deleteExpense()">
        <i class="flaticon stroke trash-2 text-danger"></i>
        Delete Expense
      </button>
    </div>
    <!-- chart Wrapper -->
    <section class="chart-container depth-2">
      <barchart v-if="cashflow.expense_amounts && cashflow.expense_amounts.length"
                :dataArray="cashflow.expense_amounts"
                :startYear="cashflow.start_year"
                :endYear="cashflow.end_year"
                :birthYear="1981"></barchart>
    </section>
    <!-- Auto Calculation, Custom Values Tabs Card-->
    <b-card no-body class="expense-tabs-card depth-1">
      <b-tabs pills card v-model="tabIndex">
        <b-tab title="Auto Calculation" :title-link-class="'expense-tab'">
          <div class="custom-values-bar" v-if="!customDisabled">
            <b-alert show variant="warning" class="py-3">Values are disabled since expense is in custom mode</b-alert>
          </div>
          <b-form id="autoCalcForm" ref="autoCalcForm" @change="autoCalcformChanged" novalidate :validated="autoCalcValidated" @submit.prevent="onAutoCalcSumbit" v-bind:class="{ 'custom-is-enabled': !customDisabled }">
            <b-container fluid>
              <b-row class="text-left mx-auto">
                <b-col lg="2">
                  <span class="text-regular">Period (start - end year) (?)</span>
                  <div class="d-flex element-spacer">
                    <b-form-group label-for="startYearInput" aria-describedby="invalidStartYearFeedback" :state="startYearState">
                      <b-form-input id="startYearInput" required v-model="expense.start_year" type="number" size="sm" v-b-tooltip.hover.bottom title="The year when this expense first occurs." class="text-regular start_end_year start_year" style="width: 86px" placeholder="Start year" min="2000" max="2140" :disabled="!customDisabled"></b-form-input>
                      <b-form-invalid-feedback id="invalidStartYearFeedback">
                        This is a required field and must be between 2000 and 2140
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <span class="date-spacer">-</span>
                    <b-form-group label-for="endYearInput" aria-describedby="invalidEndYearFeedback" :state="endYearState">
                      <b-form-input id="endYearInput" required v-model="expense.end_year" type="number" size="sm" v-b-tooltip.hover.bottom title="The year when this expense stops occuring." class="text-regular start_end_year end_year" style="width: 86px" placeholder="End year" min="2000" max="2140" :disabled="!customDisabled"></b-form-input>
                      <b-form-invalid-feedback id="invalidEndYearFeedback">
                        This is a required field and must be between 2000 and 2140
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </div>
                </b-col>
                <b-col lg="5">
                  <span class="text-regular">Amount Per Month (?)</span>
                  <div class="d-flex">
                    <vue-numeric currency="SEK" currency-symbol-position="suffix" thousand-separator=" " v-b-tooltip.hover.bottom title="The amount per period." v-model="expense.amount" class="form-control form-control-sm element-spacer text-regular amount-per-month" :min="0" :disabled="!customDisabled"></vue-numeric>
                    <b-input-group size="sm" class="element-spacer">
                      <b-form-input v-model="expense.amount" min="0" max="10000" class="slider" type="range" :disabled="!customDisabled"></b-form-input>
                    </b-input-group>
                  </div>
                </b-col>
                <b-col lg="5">
                  <span class="text-regular">Annual Growth Rate (?)</span>
                  <div class="d-flex">
                    <vue-numeric currency="%" currency-symbol-position="suffix" v-model="expense.annual_increase_percentage" v-b-tooltip.hover.bottom title="The expense grows with this percentage per year." class="form-control form-control-sm element-spacer text-regular annual-growth-rate" :min="0" :max="20" :disabled="!customDisabled"></vue-numeric>
                    <b-input-group size="sm" class="element-spacer">
                      <b-form-input v-model="expense.annual_increase_percentage" min="0" max="20" class="slider" type="range" :disabled="!customDisabled"></b-form-input>
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
              <template slot="amount" slot-scope="row">
                <vue-numeric v-show="row.item.is_edit"  currency="SEK" currency-symbol-position="suffix" thousand-separator=" "  v-model="row.item.edit_amount" class="form-control form-control-sm text-regular amount-per-month" :minus="true"></vue-numeric>
                <span v-show="!row.item.is_edit">{{row.item.amount.toLocaleString('sv-SE')}} SEK </span>
              </template>
              <template slot="actions" slot-scope="row">
                <button v-show="row.item.is_edit" class='btn plain-btn text-regular' @click.stop="saveRow(row.item)">
                  <i class="flaticon stroke checkmark text-success"></i> Save
                </button>
                <button v-show="row.item.is_edit" class='btn plain-btn text-regular' @click.stop="cancelRow(row.item)">
                  <i class="fa fa-times text-warning"></i> Cancel
                </button>
                <button v-show="!row.item.is_edit" class='btn plain-btn text-regular' :disabled="customDisabled" @click.stop="editRow(row.item)">
                  <i class="flaticon solid edit-3 text-primary"></i> Edit
                </button>
                <button class='btn plain-btn text-regular' :disabled="customDisabled" @click.stop="deleteRow(row.item)">
                  <i class="flaticon stroke trash-2 text-danger"></i> Delete
                </button>
              </template>
              <template slot="HEAD_actions" slot-scope="row">
                <button class='btn btn-sm icon-btn text-regular add-row-btn' :disabled="customDisabled"  style="border-color: #eaecef;" @click.stop="openAddRowModal">
                  <i class="flaticon stroke plus text-primary"></i>
                  Add Row
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
    <!-- Expense Information Show Card -->
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
              <button class='btn btn-sm icon-btn text-regular' style="border-color: #eaecef;" @click="openEditInfoModal">
                <i class="flaticon solid edit-3 text-primary"></i>
                Edit Info
              </button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
    <!-- Add Row Modal -->
    <b-modal id="add-row-modal" class="livsplan-modal" size="lg" v-model="addRowModalShow" hide-footer>
      <div slot="modal-header" class="w-100 mx-auto">
        <h1> Add Row </h1>
        <button type="button" class="close" aria-label="Close" @click="addRowModalShow = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <b-form id="addRowForm" ref="addRowForm" novalidate :validated="addRowValidated" @submit.prevent="onAddRowSubmit">
        <b-container style="width: 60%">
          <b-row>
            <b-col sm="3" class="d-flex justify-content-end mt-3"><label :for="'year-input'">Year</label></b-col>
            <b-col sm="9">
              <b-form-group label-for="year-input" :state="yearState" class="text-left">
                <b-form-input id="year-input" type="number" v-model="newRow.year" :state="yearState" aria-describedby="yearInputFeedback" min="2000" max="2140" required></b-form-input>
                <b-form-invalid-feedback id="yearInputFeedback">
                  Year is required and must be between 2000 and 2140
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="d-flex justify-content-end mt-3"><label :for="'amount-input'">Amount</label></b-col>
            <b-col sm="9">
              <vue-numeric currency="SEK" currency-symbol-position="suffix" thousand-separator=" " v-model="newRow.amount" class="form-control text-regular mb-3" :minus="true"></vue-numeric>
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
    <!-- Edit Info Modal -->
    <b-modal id="edit-info-modal" class="livsplan-modal" size="lg" v-model="editInfoModalShow" hide-footer>
      <div slot="modal-header" class="w-100 mx-auto">
        <h1>Edit: {{expense.name}}</h1>
        <button type="button" class="close" aria-label="Close" @click="closeEditInfoModal">
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
import _ from 'lodash'
import barchart from '../../charts/barchart'
import Switches from 'vue-switches'
import EventBus from '../../../event-bus.js'
const MAX_NUM = 999999999999

export default {
  name: 'expense',
  async mounted () {
    try {
      let response = await axios.get(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`)
      this.expense = response.data.data
      this.cashflow = this.expense
      if (this.expense.calculation_mode === 'auto') {
        this.customDisabled = true
        this.tabIndex = 0
      } else {
        this.customDisabled = false
        this.tabIndex = 1
      }
      response = await axios.get(`${process.env.ROOT_API}/categories`)
      for (let item of response.data.data) {
        this.categoryOptions.push({value: item.id, text: item.name})
      }
      setTimeout(() => {
        this.perPage = 10
      }, 1000)
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
      editExpense: {},
      newRow: {},
      periodOptions: [
        { value: null, text: 'Please select an option', disabled: true },
        { value: 'monthly', text: 'Monthly' },
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
      perPage: 0,
      filter: null,
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      pageOptions: [ 5, 10, 15, 25 ],
      totalRows: 0,
      editInfoModalShow: false,
      addRowModalShow: false,
      isCalcSaveDisabled: true,
      autoCalcValidated: false,
      editInfoValidated: false,
      addRowValidated: false,
      isSaving: false,
      customDisabled: true,
      tabIndex: 0,
      cashflow: {}
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
    yearState () {
      if (!this.addRowValidated) {
        return null
      } else {
        return (parseInt(this.newRow.year) > 1999 && parseInt(this.newRow.year) < 2141)
      }
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
          EventBus.$emit('notify-me', {
            title: 'Success!',
            text: 'New vaules have been saved successfully!',
            status: 'is-success'
          })
        } catch (err) {
          console.log(err)
          this.isSaving = false
          EventBus.$emit('notify-me', {
            title: 'Failed!',
            text: err.message,
            status: 'is-danger'
          })
        }
      }
    },
    openEditInfoModal () {
      this.autoCalcValidated = false
      this.editInfoValidated = false
      this.editInfoModalShow = true
      this.editExpense = JSON.parse(JSON.stringify(this.expense))
    },
    closeEditInfoModal () {
      this.editInfoModalShow = false
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
          EventBus.$emit('notify-me', {
            title: 'Success!',
            text: 'New vaules have been saved successfully!',
            status: 'is-success'
          })
          this.editInfoModalShow = false
          let response = await axios.get(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`)
          this.expense = response.data.data
        } catch (err) {
          console.log(err)
          EventBus.$emit('notify-me', {
            title: 'Failed!',
            text: err.message,
            status: 'is-danger'
          })
        }
      }
    },
    openAddRowModal () {
      this.addRowValidated = false
      this.addRowModalShow = true
      this.newRow = {}
    },
    async onAddRowSubmit (ev) {
      this.addRowValidated = true
      if (this.$refs.addRowForm.checkValidity() === true) {
        try {
          let data = {
            expense_id: this.expense.id,
            plan_id: this.expense.plan_id,
            year: this.newRow.year,
            amount: this.newRow.amount ? this.newRow.amount : 0
          }
          let response = await axios.post(`${process.env.ROOT_API}/expenses/${this.$route.params.id}/amounts`, data)
          this.expense.expense_amounts.push(response.data.data)
          this.addRowModalShow = false
          EventBus.$emit('notify-me', {
            title: 'Success!',
            text: 'New Row has been added successfully!',
            status: 'is-success'
          })
        } catch (err) {
          console.log(err)
          EventBus.$emit('notify-me', {
            title: 'Failed!',
            text: err.message,
            status: 'is-danger'
          })
        }
      }
    },
    editRow (item) {
      item.is_edit = true
      item.edit_amount = MAX_NUM
      item.edit_amount = item.amount
    },
    cancelRow (item) {
      item.is_edit = false
      item.edit_amount = MAX_NUM
    },
    async saveRow (item) {
      let data = {
        amount: item.edit_amount
      }
      await axios.put(`${process.env.ROOT_API}/expenses/${this.$route.params.id}/amounts/${item.id}`, data)
      item.amount = item.edit_amount
      item.edit_amount = MAX_NUM
      item.is_edit = false
    },
    async deleteRow (item) {
      await axios.delete(`${process.env.ROOT_API}/expenses/${this.$route.params.id}/amounts/${item.id}`)
      this.expense.expense_amounts = this.expense.expense_amounts.filter(amount => amount.id !== item.id)
    },
    deleteExpense () {
      let message = {
        title: 'Confirm',
        body: 'Are you sure you want to delete this expense?'
      }
      this.$dialog.confirm(message)
      .then(async () => {
        await axios.delete(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`)
        EventBus.$emit('notify-me', {
          title: 'Success!',
          text: 'This expense has been deleted successfully!',
          status: 'is-success'
        })
      })
    },
    recalculateChart: _.debounce(async (_this) => {
      if (_this.expense.calculation_mode === 'auto') {
        let data = {
          start_year: _this.expense.start_year,
          end_year: _this.expense.end_year,
          amount: _this.expense.amount,
          annual_increase_percentage: _this.expense.annual_increase_percentage,
          calculation_mode: 'auto',
          amount_recurrence: _this.expense.amount_recurrence,
          inflation_rate: _this.expense.inflation_rate
        }
        let response = await axios.post(`${process.env.ROOT_API}/expenses/amounts/calculate`, data)
        _this.cashflow = response.data.data
      }
    }, 1000)
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
        try {
          await axios.put(`${process.env.ROOT_API}/expenses/${this.$route.params.id}`, data)
          this.expense.calculation_mode = val ? 'auto' : 'custom'
          EventBus.$emit('notify-me', {
            title: 'Success!',
            text: 'Calculation mode has been updated successfully!',
            status: 'is-success'
          })
        } catch (err) {
          console.log(err)
          EventBus.$emit('notify-me', {
            title: 'Failed!',
            text: err.message,
            status: 'is-danger'
          })
        }
      }
    },
    'expense.start_year': function (val) {
      this.recalculateChart(this)
    },
    'expense.end_year': function (val) {
      this.recalculateChart(this)
    },
    'expense.amount': function (val) {
      this.recalculateChart(this)
    },
    'expense.annual_increase_percentage': function (val) {
      this.recalculateChart(this)
    }
  },
  components: {
    barchart,
    Switches
  }
}
</script>

<style lang="scss">
  @import './style.scss'
</style>
