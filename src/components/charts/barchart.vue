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
                      :height="chartHeight - yScale(d.value)"
                      :data-year="d.year"
                      fill="#F4D03F"
                      @mouseover="rectmouseover(d, i + 5)"
                      @mouseout="rectmouseout(d, i + 5)">
                </rect>
                <rect :x="xScale(startYear) + margin.left"
                      :y="margin.top - hoverrectMehrYTop"
                      :width="xScale.bandwidth()"
                      :height="chartHeight + hoverrectMehrYTop + hoverrectMehrYBottom"
                      fill="black"
                      opacity="0.35"
                      id="hoverrect">
                </rect>
            </g>
            <g>
              <line x1="0"
                    :x2="width"
                    :y1="margin.top + chartHeight + hoverrectMehrYBottom"
                    :y2="margin.top + chartHeight + hoverrectMehrYBottom"
                    stroke="#2c3468"
                    stroke-width="1">
              </line>
            </g>
            <foreignObject
                    id="tooltipForeignObj"
                    height="100"
                    width="250"
                    :visibility="this.tooltipVisible ? 'visible' : 'hidden'">
                <div class="toolTip">
                  <div>
                    <strong><span id="tooltipyear"></span></strong> ( age of <strong><span id="tooltipage"></span></strong> )
                  </div>
                  <div>
                    <span id="incomespan"></span>   Income <strong><span id="tooltipincome"></span> SEK</strong>
                  </div>
                </div>
            </foreignObject>
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
      height: 550,
      sliderHeight: 180,
      tooltipVisible: false,
      hoverrectMehrYTop: 25,
      hoverrectMehrYBottom: 60,
      margin: {
        top: 100,
        right: 15,
        bottom: 15,
        left: 65
      },
      startYear: 2018,
      endYear: 2036,
      chart: ''
    }
  },
  computed: {
    xScale () {
      let min = this.$d3.min(this.dataArray, d => d.year)
      let max = this.$d3.max(this.dataArray, d => d.year)
      return this.$d3.scaleBand()
                   .domain(this.$d3.range(min - 5, max + 1))
                   .range([0, this.chartWidth])
                   .paddingInner([0.05])
                   .paddingOuter([0.05])
    },
    yScale () {
      return this.$d3.scaleLinear()
              .domain([this.$d3.min(this.dataArray, d => d.value), this.$d3.max(this.dataArray, d => d.value)])
              .range([this.chartHeight, 0])
    },
    chartHeight () {
      return this.height - this.margin.top - this.margin.bottom - this.sliderHeight
    },
    chartWidth () {
      return this.width - this.margin.left - this.margin.right
    }
  },
  methods: {
    rectmouseover (d, i) {
      let tf = this.$d3.select('#tooltipForeignObj')
      let x = this.xScale(d.year) + this.margin.left + this.xScale.bandwidth() / 2
      let xTickCircle = this.chart.select(`#xTick-${d.year} circle`)
      xTickCircle.attr('fill', '#fff')
                  .attr('stroke', '#1971ff')
      tf.select('#tooltipyear').html(d.year)
      tf.select('#tooltipage').html(41 + i)
      tf.select('#tooltipincome').html(d.value)
      tf.transition()
        .duration(500)
        .attr('transform', `translate(${x + 10}, ${this.margin.top * 1.5})`)
      let hoverrect = this.$d3.select('#hoverrect')
      hoverrect.attr('x', this.xScale(d.year) + this.margin.left)
               .style('display', 'block')
      this.tooltipVisible = true
    },
    rectmouseout (d, i) {
      let xTickCircle = this.chart.select(`#xTick-${d.year} circle`)
      xTickCircle.attr('fill', '#1971ff')
                  .attr('stroke', '#fff')
      let hoverrect = this.$d3.select('#hoverrect')
      hoverrect.style('display', 'none')
      this.tooltipVisible = false
    },
    drawAxis () {
      let tickSize = this.chartHeight
      let xAxis = this.$d3.axisBottom(this.xScale).tickSize(-(tickSize))
      let yAxis = this.$d3.axisLeft(this.yScale).ticks(5)

      this.chart.append('g')
                .attr('class', 'axis xAxis')
                .attr('transform', `translate(${this.margin.left}, ${this.chartHeight + this.margin.top})`)
                .call(xAxis)

      this.chart.append('g')
                .attr('class', 'axis yAxis')
                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
                .call(yAxis)

      let ticks = this.chart.select('.xAxis')
                      .selectAll('.tick')
                      .attr('id', (d, i) => {
                        let year = this.xScale.domain()[0] + i
                        return `xTick-${year}`
                      })
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
      let startYearTick = this.chart.select(`#xTick-${this.startYear}`)
      let endYeartTick = this.chart.select(`#xTick-${this.endYear}`)
      let mehrHeight = 60
      let startEndTickSize = -(tickSize + mehrHeight)
      startYearTick.select('line').attr('y2', startEndTickSize)
      endYeartTick.select('line').attr('y2', startEndTickSize)
      startYearTick.append('circle')
          .attr('r', 5)
          .attr('fill', '#1971ff')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .attr('transform', `translate(0, ${startEndTickSize})`)
      endYeartTick.append('circle')
          .attr('r', 5)
          .attr('fill', '#1971ff')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .attr('transform', `translate(0, ${startEndTickSize})`)
      let startYearGroup = this.chart.append('g')
                                     .attr('transform', `translate(${this.xScale(this.startYear) + this.margin.left + this.xScale.bandwidth() / 2 + 10}, ${this.margin.top - mehrHeight + 5})`)
      let endYearGroup = this.chart.append('g')
                                     .attr('transform', `translate(${this.xScale(this.endYear) + this.margin.left + this.xScale.bandwidth() / 2 + 10}, ${this.margin.top - mehrHeight + 5})`)
      startYearGroup.append('text')
          .text('Start Year  ')
          .attr('stroke', '#fff')
      startYearGroup.append('text')
          .text(this.startYear)
          .attr('stroke', '#fff')
          .attr('dy', 20)
      endYearGroup.append('text')
          .text('End Year  ')
          .attr('stroke', '#fff')
      endYearGroup.append('text')
          .text(this.endYear)
          .attr('stroke', '#fff')
          .attr('dy', 20)
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
        width: 100%;
        margin: 0px;
        padding: 0px;
        svg {
            background-color: #525670;
            #hoverrect {
              display: none;
              pointer-events: none;
            }
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
              padding: 15px;
              text-align: left;
              div:first-child {
                margin-bottom: 20px;
              }
              #incomespan {
                width: 35px;
                height: 13px;
                display: inline-block;
                background-color: #F4D03F;
                border-radius: 4px;
              }
              #tooltipincome {
                position: relative;
                right: 0px;
              }
            }
        }
    }

</style>

