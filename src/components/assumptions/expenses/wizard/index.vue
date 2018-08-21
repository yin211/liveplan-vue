<template>
  <div class="addExpense bg-light">
    <div class="step-container">
      <div class="stepper mx-auto bg-light text-regular">
        <form-wizard @on-complete="onComplete" :title="'Create New Expense'" :subtitle="''" :stepSize="'xs'" :color="'#525670'">
          <tab-content title="Type" icon="fa fa-check">
            <step1 ref="step1" @on-validate="mergePartialModels"></step1>
          </tab-content>
          <tab-content title="Basic Details" icon="fa fa-check">
            My second tab content
          </tab-content>
          <tab-content title="Timing" icon="fa fa-check">
            My third tab content
          </tab-content>
          <tab-content title="Advanced" icon="fa fa-check">
            My fourth tab content
          </tab-content>
          <template slot="footer" slot-scope="props">
            <div class=wizard-footer-left>
              <wizard-button  v-if="props.activeTabIndex > 0 && !props.isLastStep" @click.native="props.prevTab()" :style="props.fillButtonStyle">Previous</wizard-button>
            </div>
            <div class="wizard-footer-right">
              <wizard-button v-if="!props.isLastStep && props.activeTabIndex != 0" @click.native="props.nextTab()" class="wizard-footer-right" :style="props.fillButtonStyle">Next</wizard-button>
              <wizard-button v-if="props.isLastStep" @click.native="alert('Done')" class="wizard-footer-right finish-button" :style="props.fillButtonStyle">{{props.isLastStep ? 'Done' : 'Next'}}</wizard-button>
            </div>
          </template>
        </form-wizard>
      </div>
    </div>
  </div>

</template>

<script>
// import { required, minLength, between } from 'vuelidate/lib/validators'
import step1 from './steps/step1'

export default {
  name: 'addExpense',
  data () {
    return {
      finalModel: {}
    }
  },
  methods: {
    onComplete: function () {
      alert('Yay. Done!')
    },
    mergePartialModels (model, isValid) {
      console.log(model, isValid)
      if (isValid) {
        // merging each step model into the final model
        this.finalModel = Object.assign({}, this.finalModel, model)
      }
    }
  },
  components: {
    step1
  }
}
</script>

<style lang="scss">
  @import './style.scss'
</style>
