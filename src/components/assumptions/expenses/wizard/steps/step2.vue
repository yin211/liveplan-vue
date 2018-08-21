<template>
  <div class="step2 d-flex">
    <div class="detail-text text-left">
      <p class="font-weight-medium">Setting up the Basic Details</p>
      <span class="text-gray">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
    </div>
    <div class="space-line"></div>

    <b-container>
      <b-row>
        <b-col sm="3" class="d-flex justify-content-end mt-3"><label :for="'nameInput'">Name</label></b-col>
        <b-col sm="9">
          <b-form-input id="nameInput"  v-model="name" :placeholder="'Write here'"></b-form-input>
        </b-col>
      </b-row>
    </b-container>

  </div>

</template>

<script>

export default {
  data () {
    return {
      name: null
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
  .step2 {

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
