<template>
    <div class="chart-wrapper">
        <svg id="barChartRent"
             :width="width"
             :height="height">
            <g :tranform="`translate(${margin.left}, ${margin.top})`">
                <rect v-for="(d,i) in dataArray"
                      :key="i"
                      :x="xScale(d.year) + margin.left"
                      :y="yScale(d.value) + margin.top"
                      :width="xScale.bandwidth()"
                      :height="height - margin.top - margin.bottom - yScale(d.value)"
                      fill="#F4D03F">
                </rect>
            </g>
        </svg>
    </div>
</template>

<script>
export default {
  name: 'barchart',
  props: ['dataArray'],
  data () {
    return {
      width: 0,
      height: 300,
      margin: {
        top: 15,
        right: 15,
        bottom: 25,
        left: 55
      },
      chart: ''
    }
  },
  computed: {
    xScale () {
      let min = this.$d3.min(this.dataArray, d => d.year) - 5
      let max = this.$d3.max(this.dataArray, d => d.year)
      return this.$d3.scaleBand()
                   .domain(this.$d3.range(min, max))
                   .range([0, this.width - this.margin.left - this.margin.right])
                   .paddingInner([0.05])
                   .paddingOuter([0.05])
    },
    yScale () {
      return this.$d3.scaleLinear()
              .domain([this.$d3.min(this.dataArray, d => d.value), this.$d3.max(this.dataArray, d => d.value)])
              .range([this.height - this.margin.top - this.margin.bottom, 0])
    }
  },
  methods: {
    drawAxis () {
      let xAxis = this.$d3.axisBottom(this.xScale)
      let yAxis = this.$d3.axisLeft(this.yScale)

      this.chart.append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(${this.margin.left}, ${this.height - this.margin.bottom})`)
                .call(xAxis)

      this.chart.append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
                .call(yAxis)
    },
    setWidth () {
      this.width = this.$el.offsetWidth
    }
  },
  mounted () {
    this.chart = this.$d3.select('#barChartRent g')
    this.setWidth()
    this.drawAxis()
  }
}
</script>

<style lang="scss">

    .chart-wrapper {
        svg {
            background-color: #525670;
            .axis text {
                fill: #fff;
            }
            .axis .domain, .axis line {
                stroke: #fff;
            }
        }
    }

</style>

