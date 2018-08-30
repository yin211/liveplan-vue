<template>
  <div class="addAsset bg-light">
    <div class="step-container">
      <div v-if="!isCompleted" class="stepper mx-auto bg-light text-regular">
        <form-wizard :title="'Create New Asset'" :subtitle="''" :stepSize="'xs'" :color="'#525670'"  :errorColor="'#525670'" ref="step">
          <tab-content title="Basic Details" icon="fa fa-check" :before-change="()=>validateStep('step1')">
            <step1 ref="step1" @validate-success="mergePartialModels"></step1>
          </tab-content>
          <tab-content title="Timing" icon="fa fa-check" :before-change="()=>validateStep('step2')">
            <step2 ref="step2" @validate-success="mergePartialModels"></step2>
          </tab-content>
          <tab-content title="Advanced" icon="fa fa-check">
            <step3 ref="step3" @validate-success="mergePartialModels"></step3>
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
        <span class="title">Create New Asset</span>
        <div class="mark depth-1">
          <div class="circle-check-mark"></div>
          <p>Asset Added</p>
        </div>
         <b-button class="go-assets-link pull-right mt-5" to="/assumptions/assets">Go to assets</b-button>
      </div>
    </div>
  </div>

</template>

<script>
import step1 from './steps/step1'
import step2 from './steps/step2'
import step3 from './steps/step3'
import axios from 'axios'
import EventBus from '@/event-bus.js'

export default {
  name: 'addAsset',
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
    async onComplete () {
      if (this.validateStep('step3')) {
        try {
          await axios.post(`${process.env.ROOT_API}/assets`, this.finalModel)
          this.isCompleted = true
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
    mergePartialModels (model) {
      // merging each step model into the final model
      this.finalModel = Object.assign({}, this.finalModel, model)
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
