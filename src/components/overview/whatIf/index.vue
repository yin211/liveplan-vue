<template>
  <div class="what-if depth-2">
    <div class="header d-flex justify-content-between" :class="[ isMenuShow ? 'menu' : '' ]">
      <span>What If ?</span>
      <i class="flaticon stroke up-2" :class="[ isMenuShow ? 'down-2' : 'up-2' ]"></i>
    </div>

    <div class="main" :class="{ 'd-none': isMenuShow }">
      <div class="step1" :class="{ 'd-none': currentStep !== 'step1' }">
        <div class="d-flex justify-content-between mb-3">
          <span class="font-weight-bold">Change incomes</span>
          <i class="flaticon solid right-circle-2 clickable" @click="goToStep2('incomes')"></i>
        </div>
        <div class="d-flex justify-content-between">
          <span class="mr-5 font-weight-bold">Change expenses</span>
          <i class="flaticon solid right-circle-2 ml-5 clickable" @click="goToStep2('expenses')"></i>
        </div>
      </div>

      <div class="step2" :class="{ 'd-none': currentStep !== 'step2' }">
        <div class="d-flex mb-4">
          <i class="flaticon solid left-circle-2 mr-3 clickable" @click="goToStep1"></i>
          <span class="type-label">Change {{selectedType}}</span>
        </div>
        <div v-for="item in selectedItems" :key="item.id" class="d-flex justify-content-between mb-2">
          <span class="mr-5 font-weight-bold">{{item.name}}</span>
          <i class="flaticon solid right-circle-2 ml-5 clickable" @click="goToDetail(item)"></i>
        </div>
      </div>

      <div class="step3" v-if="currentStep === 'step3'">
        <div class="d-flex mb-4">
          <i class="flaticon solid left-circle-2 mr-3 clickable" @click="goToStep2(selectedType)"></i>
          <span class="type-label">{{selectedItem.name}}</span>
        </div>
        <div>
          <div class="d-flex justify-content-center mb-4 change-item">
            <span style="position: absolute; left: 18px;">Salary</span>
            <b-form-input v-model="selectedItem.amount" min="0" max="10000" step="500" class="slider" type="range"></b-form-input>
            <span class="white-label">${{selectedItem.amount}}</span>
          </div>
          <div class="d-flex justify-content-center mb-4 change-item">
            <span style="position: absolute; left: 18px;">Annual Growth</span>
            <b-form-input v-if="selectedType === 'incomes'" v-model="selectedItem.annual_growth_rate" min="0" max="10"  class="slider" type="range"></b-form-input>
            <b-form-input v-if="selectedType === 'expenses'" v-model="selectedItem.annual_increase_percentage" min="0" max="10"  class="slider" type="range"></b-form-input>
            <span class="white-label" v-if="selectedType === 'incomes'">{{selectedItem.annual_growth_rate}}%</span>
            <span class="white-label" v-if="selectedType === 'expenses'">{{selectedItem.annual_increase_percentage}}%</span>
          </div>
          <div v-if="selectedType === 'expenses'" class="d-flex justify-content-center mb-4 change-item">
            <span style="position: absolute; left: 18px;">Inflation</span>
            <b-form-input v-model="selectedItem.inflation_rate" min="0" max="10" class="slider" type="range"></b-form-input>
            <span class="white-label">{{selectedItem.inflation_rate}}%</span>
          </div>
        </div>
        <div class="d-flex pt-2">
          <i class="flaticon solid refresh mr-3 clickable"></i>
          <span> Reset to my defaults </span>
        </div>
      </div>

    </div>

    <div class="footer d-flex justify-content-between" :class="[ isMenuShow ? 'menu' : '' ]">
      <span>Show on graph</span>
      <i class="flaticon stroke clickable" :class="[ isMenuShow ? 'up-2' : 'down-2' ]" @click="toggleMenuVisible"></i>
    </div>

    <div class="footer-expand" :class="{ 'd-none': !isMenuShow }">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <input type="checkbox" class="mr-3">
        <div class="d-flex align-items-center justify-content-between w-100">
          <span>Income salary</span>
          <div class="yello-mask"></div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between mb-3">
        <input type="checkbox" class="mr-3">
        <div class="d-flex align-items-center justify-content-between w-100">
          <span>Income from assets</span>
          <div class="pink-mask"></div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between mb-3">
        <input type="checkbox" class="mr-3">
        <div class="d-flex align-items-center justify-content-between w-100">
          <span>Retirement</span>
          <div class="red-mask"></div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between mb-3">
        <input type="checkbox" class="mr-3">
        <div class="d-flex align-items-center justify-content-between w-100">
          <span>Income allowance</span>
          <div class="blue-mask"></div>
        </div>
      </div>
      <button class='btn btn-sm btn-primary font-weight-bold mt-3'>
        Add more data
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'whatIf',
  data () {
    return {
      incomes: [],
      expenses: [],
      selectedType: null,
      selectedItems: [],
      selectedItem: null,
      currentStep: 'step1',
      isMenuShow: false
    }
  },
  async created () {
    let response = await axios.get(`${process.env.ROOT_API}/incomes`)
    this.incomes = response.data.data
    response = await axios.get(`${process.env.ROOT_API}/expenses`)
    this.expenses = response.data.data
  },
  methods: {
    goToStep1 () {
      this.currentStep = 'step1'
    },
    goToStep2 (type) {
      this.currentStep = 'step2'
      this.selectedType = type
      if (type === 'incomes') {
        this.selectedItems = this.incomes
      } else if (type === 'expenses') {
        this.selectedItems = this.expenses
      }
    },
    goToDetail (item) {
      this.currentStep = 'step3'
      this.selectedItem = {...item}
    },
    toggleMenuVisible () {
      this.isMenuShow = !this.isMenuShow
    }
  }
}
</script>

<style lang="scss">
 @import './style.scss'
</style>
