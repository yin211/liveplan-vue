<template>
  <div class="step1">
    <b-card-group deck>
      <b-card class="depth-1">
        <div class="card-body-top"></div>
        <div class="card-body-bottom">
          <p class="card-text">
            Housing costs
          </p>
          <b-button :size="'sm'" variant="primary" class="mt-3"  @click="choose_type()">Choose</b-button>
        </div>
      </b-card>
      <b-card class="depth-2">
        <div class="card-body-top"></div>
        <div class="card-body-bottom">
          <p class="card-text">
            Living costs
          </p>
          <b-button :size="'sm'" variant="primary" class="mt-3" @click="choose_type()">Choose</b-button>
        </div>
      </b-card>
      <b-card class="depth-1">
        <div class="card-body-top"></div>
        <div class="card-body-bottom">
          <p class="card-text">
            Custom
          </p>
          <b-button :size="'sm'" variant="primary" class="mt-3" @click="choose_type()">Choose</b-button>
        </div>
      </b-card>
      <b-card class="depth-1">
        <div class="card-body-top"></div>
        <div class="card-body-bottom">
          <b-form-select v-model="selected" :options="options" size="sm" style="margin-top: -10px; margin-bottom: 10px;"/>
          <b-button :size="'sm'" variant="primary" class="mt-3" @click="choose_type()">Choose</b-button>
        </div>
      </b-card>
    </b-card-group>
  </div>

</template>

<script>

export default {
  data () {
    return {
      selected: null,
      type: null,
      options: [
        { value: null, text: 'Other: Please select' }
      ]
    }
  },
  methods: {
    choose_type () {
      this.$emit('on-validate', this.type, true)
    }
  }
}
</script>

<style lang="scss">
  .step1 {
    .card-deck {
      margin-left: -36px;
      margin-right: -36px;

      .card {
        border: none;

        .card-body {
          padding: 0;
          display: flex;
          flex-direction: column;

          .card-body-top {
            height: 164px;
            opacity: 0.29;
            background-color: #525670;
          }

          .card-body-bottom {
            padding: 28px 18px 34px;

            .card-text {
              color: #232B36;
              font-size: 18px;
              font-weight: 500;
              line-height: 24px;
            }

            .btn {
              border-radius: 28px;
              padding-left: 14px;
              padding-right: 14px;
              font-weight: 500;
            }
          }
        }
      }
    }
  }
</style>
