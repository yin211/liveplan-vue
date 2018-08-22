<template>
  <div class="step1 d-flex">
    <div class="detail-text text-left">
      <p class="font-weight-medium">Setting up the Basic Details</p>
      <span class="text-gray">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
    </div>
    <div class="space-line"></div>
    <b-container>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex justify-content-end mt-3"><label :for="'nameInput'">Name</label></b-col>
        <b-col sm="9">
          <b-form-input id="nameInput"  v-model="name" :placeholder="'Write here'" class="border-0"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'subtype-select'">Subtype</label></b-col>
        <b-col sm="9">
          <b-form-select :options="subtypeOptions" :value-field="'subtype_id'" :text-field="'subtype'" v-model="subtype_id" :id="'subtype-select'" class="border-0"/>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex justify-content-end mt-3"><label :for="'descriptionInput'">Description</label></b-col>
        <b-col sm="9">
          <b-form-textarea id="descriptionInput"  v-model="description" :placeholder="'Write here'" class="border-0" :rows="3" :max-rows="6"></b-form-textarea>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex justify-content-end mt-3"><label :for="'amountInput'">Amount</label></b-col>
        <b-col sm="9" class="d-flex">
          <vue-numeric currency="SEK" currency-symbol-position="suffix" thousand-separator=" " v-model="amount" id="amountInput" class="form-control border-0 mr-3" :min="0"></vue-numeric>
          <b-form-input v-model="amount" min="0" max="10000" step="500" class="slider" type="range"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'period-select'">Period</label></b-col>
        <b-col sm="9">
          <b-form-select :options="periodOptions" v-model="amount_recurrence" :id="'period-select'" class="border-0"/>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'category-select'">Category</label></b-col>
        <b-col sm="9">
          <b-form-select :options="categoryOptions" :value-field="'id'" :text-field="'name'" v-model="category_id" :id="'category-select'" class="border-0" />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="3" class="d-flex mt-3 justify-content-end"><label :for="'person-select'">Person</label></b-col>
        <b-col sm="9">
          <b-form-select :options="personOptions" :value-field="'id'" :text-field="'name'" v-model="person_id" :id="'person-select'" class="border-0" />
        </b-col>
      </b-row>
    </b-container>

  </div>

</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      name: null,
      subtypeOptions: [],
      subtype_id: null,
      description: null,
      periodOptions: [
        { value: null, text: 'Please select', disabled: true },
        { value: 'monthly', text: 'Monthly', display: 'month' },
        { value: 'daily', text: 'Daily', display: 'day' },
        { value: 'weekly', text: 'Weekly', display: 'week' },
        { value: 'quarterly', text: 'Quarterly', display: 'quarter' },
        { value: 'semiannually', text: 'Semiannually', display: 'half-year' },
        { value: 'annually', text: 'Annually', display: 'year' },
        { value: 'onetime', text: 'One time', dispay: 'one time' }
      ],
      amount_recurrence: null,
      category_id: null,
      categoryOptions: [
        { id: null, name: 'Please select', disabled: true }
      ],
      personOptions: [
        { id: null, name: 'Please select', disabled: true }
      ],
      person_id: null,
      amount: 0
    }
  },
  async mounted () {
    try {
      let response = await axios.get(`${process.env.ROOT_API}/expenses/subtypes`)
      this.subtypeOptions = response.data
      response = await axios.get(`${process.env.ROOT_API}/categories`)
      this.categoryOptions = [...this.categoryOptions, ...response.data.data]
      response = await axios.get(`${process.env.ROOT_API}/persons`)
      this.personOptions = [...this.personOptions, ...response.data.data]
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="scss">
  .step1 {

    .detail-text {
      margin-top: 164px;
      min-width: 436px;
      max-width: 436px;
    }

    .space-line {
      height: 533px;
      width: 0;
      border: 1px solid #D7D7D7;
      margin-left: 130px;
      margin-right: 130px;
    }
  }
</style>
