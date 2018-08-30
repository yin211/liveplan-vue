<template>
  <div class="step1 d-flex">
    <div class="detail-text text-left">
      <span class="d-flex mb-2 font-weight-medium">Setting up the Basic Details</span>
      <span class="text-gray">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
    </div>
    <div class="space-line"></div>
    <b-container>
      <b-form-group id="nameInputHorizontal"
                horizontal
                breakpoint="md"
                label="Name"
                label-for="nameInput"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidNameFeedback"
                :state="!$v.name.$error">
        <b-form-input id="nameInput" v-model="name" :placeholder="'Write here'" :state="!$v.name.$error" @input="$v.name.$touch()"></b-form-input>
      </b-form-group>
      <b-form-group id="subtypeHorizontal"
                horizontal
                breakpoint="md"
                label="Subtype"
                label-for="subtypeSelect"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidSubtypeFeedback"
                :state="!$v.asset_subtype_id.$error">
        <b-form-select :options="subtypeOptions" :value-field="'subtype_id'" :text-field="'subtype'" v-model="asset_subtype_id" id="subtypeSelect" :state="!$v.asset_subtype_id.$error" @input="$v.asset_subtype_id.$touch()"/>
      </b-form-group>
      <b-form-group id="descriptionHorizontal"
                horizontal
                breakpoint="md"
                label="Description"
                label-for="descriptionInput"
                label-class="d-flex justify-content-end pr-4"
                :invalid-feedback="invalidDescriptionFeedback"
                :state="!$v.description.$error">
        <b-form-textarea id="descriptionInput"  v-model="description" :placeholder="'Write here'" :state="!$v.description.$error" @input="$v.description.$touch()" :rows="3" :max-rows="6"></b-form-textarea>
      </b-form-group>
      <b-form-group id="amountHorizontal"
                horizontal
                breakpoint="md"
                label="Amount"
                label-for="amountInput"
                label-class="d-flex align-items-center justify-content-end pr-4">
        <div class="d-flex">
          <vue-numeric currency="SEK" currency-symbol-position="suffix" thousand-separator=" " v-model="amount" id="amountInput" class="form-control border-0 mr-3" :min="0"></vue-numeric>
          <b-form-input v-model="amount" min="0" max="10000" step="500" class="slider" type="range"></b-form-input>
        </div>
      </b-form-group>
      <b-form-group id="periodHorizontal"
                horizontal
                breakpoint="md"
                label="Period"
                label-for="periodSelect"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidPeriodFeedback"
                :state="!$v.amount_recurrence.$error">
        <b-form-select :options="periodOptions" v-model="amount_recurrence" id="periodSelect" :state="!$v.amount_recurrence.$error" @input="$v.amount_recurrence.$touch()"/>
      </b-form-group>
      <b-form-group id="categoryHorizontal"
                horizontal
                breakpoint="md"
                label="Category"
                label-for="categorySelect"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidCategoryFeedback"
                :state="!$v.category_id.$error">
        <b-form-select :options="categoryOptions" :value-field="'id'" :text-field="'name'" v-model="category_id" id="categorySelect" :state="!$v.category_id.$error" @input="$v.category_id.$touch()"/>
      </b-form-group>
      <b-form-group id="personHorizontal"
                horizontal
                breakpoint="md"
                label="Person"
                label-for="personSelect"
                label-class="d-flex align-items-center justify-content-end pr-4"
                :invalid-feedback="invalidPersonFeedback"
                :state="!$v.person_id.$error">
        <b-form-select :options="personOptions" :value-field="'id'" :text-field="'name'" v-model="person_id" id="personSelect" :state="!$v.person_id.$error" @input="$v.person_id.$touch()"/>
      </b-form-group>
    </b-container>
  </div>

</template>

<script>
import axios from 'axios'
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      name: null,
      subtypeOptions: [],
      asset_subtype_id: null,
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
      let response = await axios.get(`${process.env.ROOT_API}/assets/subtypes`)
      this.subtypeOptions = response.data
      response = await axios.get(`${process.env.ROOT_API}/categories`)
      this.categoryOptions = [...this.categoryOptions, ...response.data.data]
      response = await axios.get(`${process.env.ROOT_API}/persons`)
      this.personOptions = [...this.personOptions, ...response.data.data]
    } catch (err) {
      console.log(err)
    }
  },
  validations: {
    name: {
      required
    },
    asset_subtype_id: {
      required
    },
    description: {
      required
    },
    amount: {
      required
    },
    amount_recurrence: {
      required
    },
    category_id: {
      required
    },
    person_id: {
      required
    },
    form: ['name', 'description', 'asset_subtype_id', 'amount', 'amount_recurrence', 'category_id', 'person_id']
  },
  methods: {
    validate () {
      this.$v.form.$touch()
      let isValid = !this.$v.form.$invalid
      if (isValid) {
        let data = {
          name: this.name,
          asset_subtype_id: this.asset_subtype_id,
          description: this.description,
          amount: this.amount,
          amount_recurrence: this.amount_recurrence,
          category_id: this.category_id,
          person_id: this.person_id
        }
        this.$emit('validate-success', data)
      }
      return isValid
    }
  },
  computed: {
    invalidNameFeedback () {
      if (this.$v.name.$error) {
        return 'Name is required'
      } else {
        return ''
      }
    },
    invalidSubtypeFeedback () {
      if (this.$v.asset_subtype_id.$error) {
        return 'Subtype is required'
      } else {
        return ''
      }
    },
    invalidDescriptionFeedback () {
      if (this.$v.description.$error) {
        return 'Description is required'
      } else {
        return ''
      }
    },
    invalidPeriodFeedback () {
      if (this.$v.amount_recurrence.$error) {
        return 'Period is required'
      } else {
        return ''
      }
    },
    invalidCategoryFeedback () {
      if (this.$v.category_id.$error) {
        return 'Category is required'
      } else {
        return ''
      }
    },
    invalidPersonFeedback () {
      if (this.$v.person_id.$error) {
        return 'Person is required'
      } else {
        return ''
      }
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
