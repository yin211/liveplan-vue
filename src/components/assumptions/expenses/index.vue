<template>
  <div class="expenses bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto">
        <b-link>Incomes</b-link>
        <b-link disabled>Expenses</b-link>
        <b-link>Debts</b-link>
        <b-link>Assets</b-link>
      </div>
      <!-- chart Wrapper -->
      <div class="chart-container">

      </div>
    </div>
    <div class="table-container">
      <div class="mx-auto bg-light">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'expenses',
  async mounted () {
  }
}
</script>

<style lang="scss">
  @import './style.scss'
</style>
