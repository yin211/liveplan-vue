<template>
    <div class="chart-wrapper">
        <svg id="barChartRent"
             :width="width"
             :height="height">
            <g :transform="`translate(${margin.left}, ${margin.top})`" class="chart">
                <rect v-for="(d,i) in bars"
                      :key="i"
                      :x="xScale(d.year)"
                      :y="yScale(d.value)"
                      :width="xScale.bandwidth()"
                      :height="chartHeight - yScale(d.value)"
                      :data-year="d.year"
                      fill="#F4D03F">
                </rect>
                <rect v-for="(d,i) in bars"
                      :key="`hiddenrect-${i}`"
                      :x="xScale(d.year)"
                      :y="0"
                      :width="xScale.bandwidth()"
                      :height="chartHeight + hoverrectMehrYBottom"
                      :data-year="d.year"
                      class="hiddenrect"
                      @mouseover="rectmouseover(d, i)"
                      @mouseout="rectmouseout(d, i)">
                </rect>
                <rect :x="0"
                      :y="-hoverrectMehrYTop"
                      :width="xScale.bandwidth()"
                      :height="chartHeight + hoverrectMehrYTop + hoverrectMehrYBottom"
                      fill="black"
                      opacity="0.35"
                      id="hoverrect">
                </rect>
            </g>
            <line :x1="0"
                    :x2="width"
                    :y1="margin.top + chartHeight + hoverrectMehrYBottom"
                    :y2="margin.top + chartHeight + hoverrectMehrYBottom"
                    stroke="#2c3468"
                    stroke-width="1">
            </line>
            <g :transform="`translate(${sliderMarginLeft}, ${margin.top + chartHeight + hoverrectMehrYBottom + 35})`" class="slider-wrapper">
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
                    <span id="incomespan"></span>   Income <span class="tooltip-right"><strong><span id="tooltipincome"></span> SEK</strong></span>
                  </div>
                </div>
            </foreignObject>
        </svg>
    </div>
</template>

<script>
export default {
  name: 'barchart',
  props: ['dataArray', 'startYear', 'endYear', 'birthYear'],
  data () {
    return {
      width: 0,
      height: 550,
      sliderHeight: 180,
      tooltipVisible: false,
      hoverrectMehrYTop: 25,
      hoverrectMehrYBottom: 60,
      mehrHeight: 60,
      barColor: '#FEC600',
      sliderHandlerColor: '#1971ff',
      sliderBackColor: '#636e7f',
      sliderHandlerRadius: 8,
      domain: [],
      staticDomain: [],
      maximumSliderRange: 20, // maximum 20 years
      margin: {
        top: 100,
        right: 15,
        bottom: 15,
        left: 65
      },
      chart: ''
    }
  },
  computed: {
    xScale () {
      return this.$d3.scaleBand()
                  .domain(this.domain)
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
    },
    bars () {
      return this.dataArray.filter(x => this.domain.indexOf(x.year) > -1)
    },
    sliderMarginLeft () {
      return (this.width - document.getElementById('autoCalcForm').clientWidth) / 2
    }
  },
  methods: {
    rectmouseover (d, i) {
      let locale = this.$d3.formatLocale({
        decimal: ',',
        thousands: ' ',
        grouping: [3]
      })
      let thousandsFormat = locale.format(',')
      let tf = this.$d3.select('#tooltipForeignObj')
      let x = this.xScale(d.year) + this.xScale.bandwidth() / 2 + this.margin.left
      if (d.year >= this.domain[this.domain.length - 3]) {
        x -= 270
      }
      let xTickCircle = this.chart.select(`#xTick-${d.year} circle`)
      xTickCircle.attr('fill', '#fff')
                  .attr('stroke', '#1971ff')
      tf.select('#tooltipyear').html(d.year)
      tf.select('#tooltipage').html(d.year - this.birthYear)
      tf.select('#tooltipincome').html(thousandsFormat(d.value))
      tf.transition()
        .duration(500)
        .attr('transform', `translate(${x + 10}, ${this.margin.top * 1.5})`)
      let hoverrect = this.$d3.select('#hoverrect')
      hoverrect.attr('x', this.xScale(d.year))
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

      let xAxisGroup = this.chart.selectAll('g.xAxis')
                            .data(['xAxis'])

      let yAxisGroup = this.chart.selectAll('g.yAxis')
                            .data(['yAxis'])

      xAxisGroup = xAxisGroup.enter().append('g')
                .attr('class', 'axis xAxis')
                .attr('transform', `translate(${0}, ${this.chartHeight})`)
                .merge(xAxisGroup)

      yAxisGroup = yAxisGroup.enter().append('g')
                .attr('class', 'axis yAxis')
                .merge(yAxisGroup)

      xAxisGroup.call(xAxis)

      yAxisGroup.call(yAxis)
    },
    adjustAxis () {
      let ticks = this.chart.select('g.xAxis')
                .selectAll('.tick')
                .attr('data-age', (d, i) => {
                  let year = this.xScale.domain()[0] + i
                  return year - this.birthYear
                })
                .attr('id', (d, i) => {
                  let year = this.xScale.domain()[0] + i
                  return `xTick-${year}`
                })

      let circles = ticks.selectAll('circle')
                         .data(['circle'])

      circles.enter().append('circle')
          .attr('r', 5)
          .attr('fill', '#1971ff')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)

      ticks.select('text')
           .attr('dy', '4em')

      let self = this
      let secondaryText = ticks.selectAll('text.secondaryAxisText')
                               .data(['secondaryAxisText'])

      secondaryText.enter()
          .append('text')
          .merge(secondaryText)
          .attr('class', 'secondaryAxisText')
          .attr('dy', '2.5em')
          .text(function (d, i) {
            let tick = self.$d3.select(this.parentElement)
            return tick.attr('data-age')
          })

      let startEndTickSize = -(this.chartHeight + this.mehrHeight)

      if (this.startYear >= this.domain[0]) {
        // start year circles
        let startYearTick = this.chart.select(`#xTick-${this.startYear}`)
        startYearTick.select('line').attr('y2', startEndTickSize)
        let startYearCircle = startYearTick.selectAll('circle.startYearCircle')
                                  .data(['startYearCircle'])
        startYearCircle = startYearCircle.enter()
          .append('circle')
          .attr('r', 5)
          .attr('fill', '#1971ff')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .attr('transform', `translate(0, ${startEndTickSize})`)
          .merge(startYearCircle)
        startYearCircle.attr('class', 'startYearCircle')
        let startYearGroup = this.chart.selectAll('g.startYear')
                               .data(['startYear'])
        startYearGroup = startYearGroup.enter()
                                     .append('g')
                                     .attr('class', 'startYear')
                                     .merge(startYearGroup)
        startYearGroup.attr('transform', `translate(${this.xScale(this.startYear) + this.xScale.bandwidth() / 2 + 10}, ${this.mehrHeight - this.margin.top - 15})`)
        startYearGroup.selectAll('text.startYearTxt')
          .data(['startYearTxt'])
          .enter()
          .append('text')
          .attr('class', 'startYearTxt')
          .text('Start Year')
          .attr('stroke', '#fff')

        startYearGroup.selectAll('text.endYearTxt')
            .data(['endYearTxt'])
            .enter()
            .append('text')
            .attr('class', 'endYearTxt')
            .text(this.startYear)
            .attr('stroke', '#fff')
            .attr('dy', 20)
      } else {
        this.chart.selectAll('g.startYear').remove()
      }

      if (this.endYear <= this.domain[this.domain.length - 1]) {
        let endYeartTick = this.chart.select(`#xTick-${this.endYear}`)
        endYeartTick.select('line').attr('y2', startEndTickSize)
        let endYearCircle = endYeartTick.selectAll('circle.endYearCircle')
                              .data(['endYearCircle'])

        endYearCircle = endYearCircle.enter()
          .append('circle')
          .attr('r', 5)
          .attr('fill', '#1971ff')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .attr('transform', `translate(0, ${startEndTickSize})`)
          .merge(endYearCircle)
        endYearCircle.attr('class', 'endYearCircle')
        let endYearGroup = this.chart.selectAll('g.endYear')
                              .data(['endYear'])

        endYearGroup = endYearGroup.enter()
                                     .append('g')
                                     .attr('class', 'endYear')
                                     .merge(endYearGroup)
        endYearGroup.attr('transform', `translate(${this.xScale(this.endYear) + this.xScale.bandwidth() / 2 + 10}, ${this.mehrHeight - this.margin.top - 15})`)
        endYearGroup.selectAll('text.startYearY')
          .data(['startYearY'])
          .enter()
          .append('text')
          .attr('class', 'startYearY')
          .text('End Year')
          .attr('stroke', '#fff')

        endYearGroup.selectAll('text.endYearY')
          .data(['endYearY'])
          .enter()
          .append('text')
          .attr('class', 'endYearY')
          .text(this.endYear)
          .attr('stroke', '#fff')
          .attr('dy', 20)
      } else {
        this.chart.selectAll('g.endYear').remove()
      }
    },
    drawSlider (selection, width) {
      var padding = 50
      var self = this
      var scale = this.$d3
                      .scaleBand()
                      .domain(this.staticDomain)
                      .range([0, width - padding * 2])
      var currentSelectedArea = [scale(this.domain[0]), scale(this.domain[this.domain.length - 1]) + scale.bandwidth()]
      // append texts
      let startText = selection.selectAll('text.sliderStartTxt')
                               .data(['sliderStartTxt'])
      let endText = selection.selectAll('text.sliderEndTxt')
                             .data(['sliderEndTxt'])
      startText.enter()
               .append('text')
               .attr('class', 'sliderStartTxt')
               .text(this.staticDomain[0])
               .attr('fill', '#fff')
      endText = endText.enter()
                .append('text')
                .attr('class', 'sliderEndTxt')
                .text(this.staticDomain[this.staticDomain.length - 1])
                .attr('fill', '#fff')
                .merge(endText)

      endText.attr('x', width - 35)

      // slider group
      var slider = selection.selectAll('g.slider')
                            .data(['slider'])

      slider = slider.enter()
               .append('g')
               .merge(slider)
               .attr('class', 'slider')
               .attr('overflow', 'visible')
               .attr('transform', `translate(${padding}, ${-6})`)

      var firstLine = slider.selectAll('line.firstSliderLine')
                            .data(['firstSliderLine'])

      firstLine = firstLine.enter()
        .append('line')
        .attr('class', 'firstSliderLine')
        .attr('stroke-width', 6)
        .attr('stroke', this.sliderBackColor)
        .attr('stroke-linecap', 'round')
        .merge(firstLine)

      firstLine.attr('x2', width - padding * 2)

      var secondLine = slider.selectAll('line.secondSliderLine')
                            .data(['secondSliderLine'])

      secondLine = secondLine.enter()
        .append('line')
        .attr('class', 'secondSliderLine')
        .attr('stroke-width', 2)
        .attr('stroke', '#fff')
        .attr('stroke-linecap', 'round')
        .merge(secondLine)

      secondLine.attr('x1', currentSelectedArea[0])
                .attr('x2', currentSelectedArea[1])

      // first circle group
      var firstCircleGroup = slider.selectAll('g.firstCircleGroup')
                                   .data(['firstCircleGroup'])

      firstCircleGroup = firstCircleGroup.enter().append('g')
                                   .attr('class', 'firstCircleGroup')
                                   .call(this.$d3.drag()
                                    .on('drag', d => {
                                      return dragged(d, 'first')
                                    })
                                    .on('end', d => {
                                      return dragEnd(d)
                                    }))
                                    .merge(firstCircleGroup)

      var firstCircle = firstCircleGroup.selectAll('circle.firstCircle')
                          .data(['firstCircle'])

      firstCircle = firstCircle.enter().append('circle')
                         .attr('cursor', 'pointer')
                         .attr('r', this.sliderHandlerRadius)
                         .attr('fill', this.sliderHandlerColor)
                         .attr('stroke', '#fff')
                         .attr('stroke-width', 0.5)
                         .merge(firstCircle)

      firstCircle.attr('class', 'firstCircle')

      var vBarsFirst = firstCircleGroup.selectAll('line.vBarFirst')
                            .data([-1, 0, 1])

      vBarsFirst = vBarsFirst.enter()
                        .append('line')
                        .attr('x1', d => d * 2)
                        .attr('x2', d => d * 2)
                        .attr('y1', -3)
                        .attr('y2', 3)
                        .attr('stroke', '#fff')
                        .merge(vBarsFirst)

      vBarsFirst.attr('class', 'vBarFirst')

      firstCircleGroup.attr('transform', `translate(${currentSelectedArea[0]})`)

      // second circle group
      var secondCircleGroup = slider.selectAll('g.secondCircleGroup')
                                   .data(['secondCircleGroup'])

      secondCircleGroup = secondCircleGroup.enter().append('g')
                                   .attr('class', 'secondCircleGroup')
                                   .call(this.$d3.drag()
                                    .on('drag', d => {
                                      return dragged(d, 'second')
                                    })
                                    .on('end', d => {
                                      return dragEnd(d)
                                    }))
                                    .merge(secondCircleGroup)

      var handler = secondCircleGroup.selectAll('circle.handler')
                          .data(['handler'])

      handler = handler.enter()
                       .append('circle')
                       .attr('cursor', 'pointer')
                       .attr('data-curentPercentCx', 0)
                       .attr('r', this.sliderHandlerRadius)
                       .attr('fill', this.sliderHandlerColor)
                       .attr('stroke', '#fff')
                       .attr('stroke-width', 0.5)
                       .merge(handler)

      handler.attr('class', 'handler')

      var vBarsSecond = secondCircleGroup.selectAll('line.vBarSecond')
                            .data([-1, 0, 1])

      vBarsSecond = vBarsSecond.enter()
                        .append('line')
                        .attr('x1', d => d * 2)
                        .attr('x2', d => d * 2)
                        .attr('y1', -3)
                        .attr('y2', 3)
                        .attr('stroke', '#fff')
                        .merge(vBarsSecond)

      vBarsSecond.attr('class', 'vBarSecond')

      secondCircleGroup.attr('transform', `translate(${currentSelectedArea[1]})`)

      // drag handlers
      function dragged (d, flag) {
        var cx = getDragCoord()
        if (flag === 'first') {
          if (cx > currentSelectedArea[1] - scale.bandwidth() * self.maximumSliderRange) {
            cx = currentSelectedArea[1] - scale.bandwidth() * self.maximumSliderRange
          }
          currentSelectedArea[0] = cx
          firstCircleGroup.attr('transform', `translate(${currentSelectedArea[0]})`)
          secondLine.attr('x1', cx)
        } else {
          if (cx < currentSelectedArea[0] + scale.bandwidth() * self.maximumSliderRange) {
            cx = currentSelectedArea[0] + scale.bandwidth() * self.maximumSliderRange
          }
          currentSelectedArea[1] = cx
          secondCircleGroup.attr('transform', `translate(${currentSelectedArea[1]})`)
          secondLine.attr('x2', cx)
        }
      }

      function dragEnd () {
        let newDomain = getNewDomain()
        self.domain = newDomain
        self.drawAxis()
        self.adjustAxis()
      }

      function getNewDomain () {
        let sliderBandWidth = scale.bandwidth()
        let f = Math.round(currentSelectedArea[0] / sliderBandWidth)
        let s = Math.round(currentSelectedArea[1] / sliderBandWidth)
        return self.$d3.range(self.staticDomain[f], self.staticDomain[s - 1] + 1)
      }

      function getDragCoord () {
        var cx = self.$d3.event.x
        if (cx < 0) cx = 0
        else if (cx > width - padding * 2) cx = width - padding * 2
        return cx
      }
    },
    setWidth () {
      this.width = this.$el.offsetWidth
    },
    setDomain () {
      let min = this.$d3.min(this.dataArray, d => d.year)
      let max = this.$d3.max(this.dataArray, d => d.year)
      this.domain = this.$d3.range(min, max + 1)
      this.staticDomain = this.domain
    },
    onResize () {
      this.setWidth()
      this.drawAxis()
      this.adjustAxis()
      this.drawSlider(this.$d3.select('g.slider-wrapper'), this.width - 2 * this.sliderMarginLeft)
    }
  },
  mounted () {
    this.chart = this.$d3.select('#barChartRent g')
    this.setDomain()
    this.onResize()
    this.$d3.select(window).on('resize', this.onResize)
  }
}
</script>

<style lang="scss">

    .chart-wrapper {
        width: 100%;
        margin: 0px;
        padding: 0px;
        svg {
            background: linear-gradient(193.11deg, #685B7A 0%, #445B7C 100%);
            box-shadow: 20px 22px 44px 0 rgba(82,86,112,0.55);
            #hoverrect {
              display: none;
              pointer-events: none;
            }
            .hiddenrect {
              fill: transparent;
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
              padding: 20px;
              text-align: left;
              div:first-child {
                margin-bottom: 20px;
              }
              #incomespan {
                width: 35px;
                height: 13px;
                display: inline-block;
                background-color: #FEC600;
                border-radius: 4px;
              }
              #tooltipincome {
                position: relative;
                right: 0px;
              }
              .tooltip-right {
                float: right;
              }
            }
        }
    }

</style>

