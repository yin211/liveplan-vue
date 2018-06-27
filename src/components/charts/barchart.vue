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
                      fill="#F4D03F"
                      @mouseover="rectmouseover(d, i)"
                      @mouseout="rectmouseout()">
                </rect>
                <foreignObject
                        id="tooltipForeignObj"
                        height="140"
                        width="300"
                        :visibility="this.tooltipVisible ? 'visible' : 'hidden'">
                    <div class="toolTip">
                      <div>
                        <strong><span id="tooltipyear"></span></strong> ( age of <strong><span id="tooltipage"></span></strong> )
                      </div>
                      <div>
                        <span id="incomespan"></span> Income <strong><span id="tooltipincome"></span></strong>
                      </div>
                    </div>
                </foreignObject>
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
      height: 400,
      tooltipVisible: false,
      margin: {
        top: 100,
        right: 15,
        bottom: 55,
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
    rectmouseover (d, i) {
      this.tooltipVisible = true
      let tf = this.chart.select('#tooltipForeignObj')
      let x = this.xScale(d.year) + this.margin.left + this.xScale.bandwidth() / 2

      tf.select('#tooltipyear').html(d.year)
      tf.select('#tooltipage').html(41 + i)
      tf.transition()
        .duration(500)
        .attr('transform', `translate(${x + 10}, ${this.margin.top * 1.5})`)
    },
    rectmouseout () {
      console.log('mouse overed')
      this.tooltipVisible = false
    },
    drawAxis () {
      let xAxis = this.$d3.axisBottom(this.xScale).tickSize(-(this.height - this.margin.top - this.margin.bottom))
      let yAxis = this.$d3.axisLeft(this.yScale)

      this.chart.append('g')
                .attr('class', 'axis xAxis')
                .attr('transform', `translate(${this.margin.left}, ${this.height - this.margin.bottom})`)
                .call(xAxis)

      this.chart.append('g')
                .attr('class', 'axis yAxis')
                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
                .call(yAxis)

      let ticks = this.chart.select('.xAxis')
                      .selectAll('.tick')

      ticks.append('circle')
          .attr('r', 5)
          .attr('fill', '#1971ff')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
      ticks.selectAll('text')
           .attr('dy', '4em')
      ticks.append('text')
          .attr('dy', '2.5em')
          .text((d, i) => 41 + i)
    },
    setWidth () {
      this.width = this.$el.offsetWidth - 10
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
            .axis  {
              pointer-events: none;
              line {
                stroke: #fff;
                stroke-dasharray: 4px;
              }
              .domain {
                display: none;
              }
            }
            #tooltipForeignObj {
              pointer-events: none;
            }
            .toolTip {
              background-color: #fff;
              #incomespan {
                width: 25px;
                height: 15px;
                background-color: #F4D03F;
                border-radius: 4px;
              }
            }
        }
    }

</style>

