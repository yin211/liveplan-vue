<template>
  <div class="addExpense bg-light">
    <div class="step-container">
      <div v-if="!isCompleted" class="stepper mx-auto bg-light text-regular">
        <form-wizard :title="'Create New Expense'" :subtitle="''" :stepSize="'xs'" :color="'#525670'" ref="step">
          <tab-content title="Basic Details" icon="fa fa-check" :before-change="()=>validateStep('step1')">
            <step1 ref="step1" @on-validate="mergePartialModels"></step1>
          </tab-content>
          <tab-content title="Timing" icon="fa fa-check">
            <step2 @on-validate="mergePartialModels"></step2>
          </tab-content>
          <tab-content title="Advanced" icon="fa fa-check">
            <step3 @on-validate="mergePartialModels"></step3>
          </tab-content>
          <template slot="footer" slot-scope="props">
            <div :class="{ hasSpace: props.activeTabIndex != 0 }">
              <div class=wizard-footer-left>
                <wizard-button  v-if="props.activeTabIndex > 0" @click.native="props.prevTab()" :style="props.fillButtonStyle">Back</wizard-button>
              </div>
              <div class="line" v-if="props.activeTabIndex != 0"></div>
              <div class="wizard-footer-right">
                <wizard-button v-if="!props.isLastStep" @click.native="props.nextTab()" class="wizard-footer-right" :style="props.fillButtonStyle">Next</wizard-button>
                <wizard-button v-else @click.native="onComplete" class="wizard-footer-right finish-button" :style="props.fillButtonStyle">Next</wizard-button>
              </div>
            </div>
          </template>
        </form-wizard>
      </div>
      <div v-else class="complete mx-auto bg-light text-regular">
        <span class="title">Create New Expense</span>
        <div class="mark">
          <i class="flaticon stroke checkmark-2 text-success"></i>
          <p>Expense Added</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import step1 from './steps/step1'
import step2 from './steps/step2'
import step3 from './steps/step3'

export default {
  name: 'addExpense',
  data () {
    return {
      finalModel: {},
      isCompleted: false
    }
  },
  methods: {
    validateStep (name) {
      var refToValidate = this.$refs[name]
      return refToValidate.validate()
    },
    onComplete () {
      this.isCompleted = true
    },
    mergePartialModels (model, isValid) {
      console.log(model, isValid)
      if (isValid) {
        // merging each step model into the final model
        this.finalModel = Object.assign({}, this.finalModel, model)
        this.$refs['step'].nextTab()
      }
    }
  },
  components: {
    step1,
    step2,
    step3
  }
}
</script>

<style lang="scss">
  @import './style.scss'
</style>
