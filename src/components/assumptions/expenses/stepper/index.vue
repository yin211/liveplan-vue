<template>
  <div class="addExpense bg-light">
    <div class="step-container">
      <div class="stepper mx-auto bg-light text-regular">
        <form-wizard @on-complete="onComplete" :title="'Create New Expense'" :subtitle="''" :stepSize="'xs'" :color="'#525670'">
          <tab-content title="Type" icon="fa fa-check">
            My first tab content
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
          <!-- <template slot="footer" slot-scope="props">
            <div class=wizard-footer-left>
              <wizard-button  v-if="props.activeTabIndex > 0 && !props.isLastStep" :style="props.fillButtonStyle">Previous</wizard-button>
            </div>
            <div class="wizard-footer-right">
              <wizard-button v-if="!props.isLastStep" @click.native="props.nextTab()" class="wizard-footer-right" :style="props.fillButtonStyle">Next</wizard-button>
              <wizard-button v-else @click.native="alert('Done')" class="wizard-footer-right finish-button" :style="props.fillButtonStyle">{{props.isLastStep ? 'Done' : 'Next'}}</wizard-button>
            </div>
          </template> -->
        </form-wizard>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'addExpense',
    methods: {
      onComplete: function () {
        alert('Yay. Done!')
      }
    }
  }
</script>

<style lang="scss">
  @import './style.scss'
</style>
