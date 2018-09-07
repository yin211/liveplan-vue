<template>
  <div class="overview bg-light">
    <div class="main-gradient">
      <div class="title-container mx-auto">
        <b-link>Cashflow</b-link>
        <b-link>Equity</b-link>
        <b-link>Timeline</b-link>
        <b-link>Portfolio</b-link>
      </div>
      <!-- chart Wrapper -->
      <div class="chart-container">

      </div>
    </div>
    <div class="table-container">
      <div class="mx-auto bg-light text-regular text-left">
        <income-table class="mb-5"></income-table>
        <expense-table class="mb-5"></expense-table>
        <asset-table class="mb-5"></asset-table>
        <debt-table></debt-table>
      </div>
    </div>
  </div>
</template>

<script>
import incomeTable from '@/components/tables/income'
import expenseTable from '@/components/tables/expense'
import assetTable from '@/components/tables/asset'
import debtTable from '@/components/tables/debt'

export default {
  name: 'overview',
  components: {
    incomeTable,
    expenseTable,
    assetTable,
    debtTable
  }
}
</script>

<style lang="scss">
 @import './style.scss'
</style>
