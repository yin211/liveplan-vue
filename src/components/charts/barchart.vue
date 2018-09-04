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
                      :fill="barColor"
                      :opacity="calcOpacity(d, i)"
                      class="bar">
                </rect>
                <text v-if="debug"
                      v-for="(d,i) in bars"
                      :key="`text-${i}`"
                      :x="xScale(d.year)"
                      :y="yScale(d.value) - 8"
                      :fill="darkColor">
                      {{ d.value }}
                </text>
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
                    :stroke="divisionLineColor"
                    stroke-width="0.5">
            </line>
            <g :transform="`translate(${sliderMarginLeft}, ${margin.top + chartHeight + hoverrectMehrYBottom + 35})`" class="slider-wrapper">
            </g>
            <Tooltip :obj="tooltipObj"
                     :svgWidth="width"
                     :svgHeight="height"
                     :handleOverflow="false">
            </Tooltip>
        </svg>
    </div>
</template>

<script>
import patternify from './d3-assets/patternify'
import Tooltip from './d3-assets/Tooltip'

export default {
  name: 'barchart',
  props: ['label', 'dataObject', 'startYear', 'endYear', 'planStartYear', 'planEndYear', 'birthYear'],
  data () {
    return {
      width: 0,
      height: 550,
      sliderHeight: 180,
      hoverrectMehrYTop: 25,
      hoverrectMehrYBottom: 60,
      mehrHeight: 60,
      axisCircleSize: 4,
      divisionLineColor: '#404A65',
      barColor: '#FEC600',
      sliderBackColor: '#636e7f',
      circleColor: '#0065FF',
      darkColor: '#A5ADBA',
      sliderHandlerRadius: 12,
      domain: [],
      staticDomain: [],
      capacityPercentage: 0.2,
      zoomArea: [],
      tooltipObj: {
        visible: false
      },
      margin: {
        top: 100,
        right: 15,
        bottom: 15,
        left: 110
      },
      chart: '',
      debug: false
    }
  },
  computed: {
    computedData () {
      let startYear = this.startYear < this.planStartYear ? this.startYear : this.planStartYear
      let endYear = this.endYear > this.planEndYear ? this.endYear : this.planEndYear
      let range = this.$d3.range(startYear, endYear + 1)
      return range.map(d => {
        let f = this.dataObject.filter(x => +x.year === d)
        let amount = 0
        if (f.length) {
          amount = Math.abs(f[0].amount)
        }
        return {
          year: d,
          value: amount
        }
      })
    },
    sliderWidth () {
      return this.width - 2 * this.sliderMarginLeft
    },
    sliderScale () {
      let padding = 60
      return this.$d3
                .scaleBand()
                .domain(this.staticDomain)
                .range([0, this.sliderWidth - padding * 2])
    },
    xScale () {
      return this.$d3.scaleBand()
                  .domain(this.domain)
                  .range([0, this.chartWidth])
                  .paddingInner([0.02])
                  .paddingOuter([0.1])
    },
    yScale () {
      const max = this.$d3.max(this.computedData, d => d.value)
      return this.$d3.scaleLinear()
              .domain([0, max + 10000])
              .range([this.chartHeight, 0])
    },
    chartHeight () {
      return this.height - this.margin.top - this.margin.bottom - this.sliderHeight
    },
    chartWidth () {
      return this.width - this.margin.left - this.margin.right
    },
    bars () {
      return this.computedData.filter(x => this.domain.indexOf(x.year) > -1)
    },
    sliderMarginLeft () {
      return (this.width - document.getElementById('autoCalcForm').clientWidth) / 2
    },
    maximumSliderRange () {
      return Math.round(this.computedData.length / 2.5)
    }
  },
  methods: {
    thousandsFormat (value) {
      let locale = this.$d3.formatLocale({
        decimal: ',',
        thousands: ' ',
        grouping: [3]
      })
      return locale.format(',')(value)
    },
    rectmouseover (d, i) {
      let html = `<div class="toolTip">
                    <div class="mt-2 year">
                      <strong><span>${d.year}</span></strong> ( age of <strong><span>${d.year - this.birthYear}</span></strong> )
                    </div>
                    <div class="d-flex mt-4">
                      <div class="mr-3">
                        <span class="income-span"></span><span class="ml-2 label-span">${this.label}</span>
                      </div>
                      <div class="ml-4">
                        <strong><span id="amount-span">${this.thousandsFormat(d.value)}</span> SEK</strong>
                      </div>
                    </div>
                  </div>`

      let x = this.xScale(d.year) + this.xScale.bandwidth() / 2 + this.margin.left
      let y = this.margin.top * 1.5

      if (x + 340 > this.width) {
        x -= 340
      }

      this.tooltipObj = {
        x: x,
        y: y,
        html: html,
        visible: true
      }

      // current tick selection
      let xTick = this.chart.select(`#xTick-${d.year}`)

      // make circle bigger and filled white
      let xTickCircle = xTick.select('circle')
      xTickCircle.attr('fill', '#fff')
                  .attr('stroke', '#1971ff')
                  .attr('r', 5)

      // display hover rect
      let hoverrect = this.$d3.select('#hoverrect')
      hoverrect.attr('x', this.xScale(d.year))
               .style('display', 'block')

      // make texts a little bit bigger
      xTick.selectAll('text').attr('fill', '#fff').attr('font-weight', 600)
    },
    rectmouseout (d, i) {
      // current tick selection
      let xTick = this.chart.select(`#xTick-${d.year}`)

      // make circle smaller
      let xTickCircle = xTick.select('circle')
      xTickCircle.attr('fill', '#1971ff')
                  .attr('stroke', '#fff')
                  .attr('r', 4)

      // hide hover rect
      let hoverrect = this.$d3.select('#hoverrect')
      hoverrect.style('display', 'none')

      // make texts smaller
      xTick.selectAll('text').attr('fill', this.darkColor).attr('font-weight', 400)
      this.tooltipObj.visible = false
    },
    calcOpacity (d, i) {
      const length = this.domain[this.domain.length - 1] - this.domain[0]
      const l = Math.round(length * this.capacityPercentage)
      const h = length - l

      let sc = this.$d3.scaleLinear().clamp(true)

      if (i <= l) {
        sc.domain([0, l]).range([0.25, 1])
        return sc(i)
      }
      if (i >= h) {
        sc.domain([h, this.domain.length - 1]).range([1, 0.25])
        return sc(i)
      }
      return 1
    },
    drawAxis () {
      let tickSize = this.chartHeight
      let xAxis = this.$d3.axisBottom(this.xScale).tickSize(-(tickSize))
      let yAxis = this.$d3.axisLeft(this.yScale).ticks(5).tickFormat(d => this.thousandsFormat(d) + ' Kr')

      // append xAxis
      patternify({
        container: this.chart,
        tag: 'g',
        selector: 'xAxis'
      })
      .attr('class', 'xAxis axis')
      .attr('transform', `translate(${0}, ${this.chartHeight})`)
      .call(xAxis)

      // append yAxis
      patternify({
        container: this.chart,
        tag: 'g',
        selector: 'yAxis'
      })
      .attr('class', 'yAxis axis')
      .call(yAxis)
    },
    adjustAxis () {
      let self = this
      let startEndTickSize = -(this.chartHeight + this.mehrHeight)

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
                .attr('opacity', (d, i) => {
                  return this.calcOpacity(d, i)
                })

      ticks.select('line')
        .attr('stroke', this.darkColor)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '3 1.5')

      // reposition texts within the axis
      ticks.select('text')
           .attr('class', 'tick-year')
           .attr('dy', '4em')
           .attr('fill', this.darkColor)
           .attr('font-family', 'Roboto')

      // append circles
      patternify({
        container: ticks,
        tag: 'circle',
        selector: 'tickCircle'
      })
      .attr('r', this.axisCircleSize)
      .attr('fill', this.circleColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)

      // append ages
      patternify({
        container: ticks,
        tag: 'text',
        selector: 'secondaryAxisText'
      })
      .attr('class', 'secondaryAxisText')
      .attr('dy', '2.5em')
      .attr('font-family', 'Roboto')
      .text(function (d, i) {
        let tick = self.$d3.select(this.parentElement)
        return tick.attr('data-age')
      })

      // adjust xAxis
      let yTicks = this.chart.select('g.yAxis')
          .selectAll('.tick')

      // reposition lines
      yTicks.select('line')
        .attr('x1', (d, i) => {
          if (i) {
            return -7
          }
          return 0
        })
        .attr('x2', (d, i) => {
          if (i) {
            return 4
          }
          return 0
        })
        .attr('stroke-width', 2)

      yTicks.select('text')
        .attr('x', -24)
        .attr('font-family', 'Roboto')

      // append circles
      patternify({
        container: yTicks,
        tag: 'circle',
        selector: 'tickCircle'
      })
      .attr('r', this.axisCircleSize)
      .attr('cx', -10)
      .attr('fill', '#6D7290')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)

      if (this.startYear >= this.domain[0]) {
        this.chart.selectAll('circle.startYearCircle')
            .remove()
        // start year tick selection
        let startYearTick = this.chart.select(`#xTick-${this.startYear}`)
        startYearTick
          .select('line')
          .attr('y2', startEndTickSize)
          .attr('stroke', '#fff')
          .style('opacity', 1)

        // append circle for the startYear tick
        patternify({
          container: startYearTick,
          tag: 'circle',
          selector: 'startYearCircle'
        })
        .attr('r', this.axisCircleSize)
        .attr('fill', this.circleColor)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('transform', `translate(0, ${startEndTickSize})`)

        // start year text group
        let startYearGroup = patternify({
          container: this.chart,
          tag: 'g',
          selector: 'startYear'
        })
        .attr('transform', `translate(${this.xScale(this.startYear) + this.xScale.bandwidth() / 2 + 10}, ${this.mehrHeight - this.margin.top - 15})`)

        patternify({
          container: startYearGroup,
          tag: 'text',
          selector: 'startYearTxt'
        })
        .text('Start Year')
        .attr('fill', this.darkColor)
        .attr('font-size', '0.8rem')
        .attr('font-family', 'Roboto')

        patternify({
          container: startYearGroup,
          tag: 'text',
          selector: 'startYearY'
        })
        .text(this.startYear)
        .attr('fill', '#fff')
        .attr('font-size', '13px')
        .attr('dy', 16)
        .attr('font-family', 'Roboto')
      } else {
        this.chart.selectAll('g.startYear').remove()
      }

      if (this.endYear <= this.domain[this.domain.length - 1]) {
        this.chart.selectAll('circle.endYearCircle')
            .remove()
        // end year tick selection
        let endYeartTick = this.chart.select(`#xTick-${this.endYear}`)
        endYeartTick
          .select('line')
          .attr('y2', startEndTickSize)
          .attr('stroke', '#fff')
          .attr('opacity', 0.7)

        // add circle to the end year tick
        patternify({
          container: endYeartTick,
          tag: 'circle',
          selector: 'endYearCircle'
        })
        .attr('r', this.axisCircleSize)
        .attr('fill', '#1971ff')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('transform', `translate(0, ${startEndTickSize})`)

        let translateX = this.xScale(this.endYear) + this.xScale.bandwidth() / 2 + 10
        let translateY = this.mehrHeight - this.margin.top - 15

        if (this.endYear >= this.domain[this.domain.length - 2]) {
          translateX -= 70
        }

        // end year text group
        let endYearGroup = patternify({
          container: this.chart,
          tag: 'g',
          selector: 'endYear'
        })
        .attr('transform', `translate(${translateX}, ${translateY})`)

        patternify({
          container: endYearGroup,
          tag: 'text',
          selector: 'endYearTxt'
        })
        .text('End Year')
        .attr('fill', this.darkColor)
        .attr('font-size', '0.8rem')
        .attr('font-family', 'Roboto')

        patternify({
          container: endYearGroup,
          tag: 'text',
          selector: 'endYearY'
        })
        .text(this.endYear)
        .attr('fill', '#fff')
        .attr('font-size', '13px')
        .attr('dy', 16)
        .attr('font-family', 'Roboto')
      } else {
        this.chart.selectAll('g.endYear').remove()
      }
    },
    drawSlider (selection, width) {
      var padding = 60
      var self = this

      var currentSelectedArea
      if (this.zoomArea.length) {
        currentSelectedArea = this.zoomArea
      } else {
        currentSelectedArea = [this.sliderScale(this.domain[0]), this.sliderScale(this.domain[this.domain.length - 1]) + this.sliderScale.bandwidth()]
      }

      // append texts
      patternify({
        container: selection,
        tag: 'text',
        selector: 'sliderStartTxt'
      })
      .text(this.staticDomain[0])
      .attr('fill', '#fff')
      .attr('font-family', 'Roboto')

      patternify({
        container: selection,
        tag: 'text',
        selector: 'sliderEndTxt'
      })
      .text(this.staticDomain[this.staticDomain.length - 1])
      .attr('fill', '#fff')
      .attr('x', width - 35)
      .attr('font-family', 'Roboto')

      // slider group
      var slider = patternify({
        container: selection,
        tag: 'g',
        selector: 'slider'
      })
      .attr('overflow', 'visible')
      .attr('transform', `translate(${padding}, ${-6})`)

      // background line
      patternify({
        container: slider,
        tag: 'line',
        selector: 'backgroundLine'
      })
      .attr('stroke-width', 8)
      .attr('stroke', this.sliderBackColor)
      .attr('stroke-linecap', 'round')
      .attr('x2', width - padding * 2)

      // foreground line
      let foregroundLine = patternify({
        container: slider,
        tag: 'line',
        selector: 'foregroundLine'
      })
      .attr('stroke-width', 3)
      .attr('stroke', '#fff')
      .attr('cursor', 'pointer')
      .attr('stroke-linecap', 'round')
      .attr('x1', currentSelectedArea[0])
      .attr('x2', currentSelectedArea[1])
      .on('mouseover', lineMouseOver)
      .on('mouseout', lineMouseOut)
      .call(this.$d3.drag()
              .on('start', lineDragStart)
              .on('drag', lineDrag)
              .on('end', lineDragEnd))

      // first circle group
      let firstCircleGroup = patternify({
        container: slider,
        tag: 'g',
        selector: 'firstCircleGroup'
      })
      .attr('transform', `translate(${currentSelectedArea[0]})`)
      .call(this.$d3.drag()
              .on('drag', d => {
                return dragged(d, 'first')
              }))

      // second circle group
      var secondCircleGroup = patternify({
        container: slider,
        tag: 'g',
        selector: 'secondCircleGroup'
      })
      .attr('transform', `translate(${currentSelectedArea[1]})`)
      .call(this.$d3.drag()
              .on('drag', d => {
                return dragged(d, 'second')
              }))

      patternify({
        container: firstCircleGroup,
        tag: 'circle',
        selector: 'firstCircle'
      })
      .attr('cursor', 'pointer')
      .attr('r', this.sliderHandlerRadius)
      .attr('fill', this.circleColor)
      .attr('stroke', this.darkColor)
      .attr('stroke-width', 1.5)

      patternify({
        container: secondCircleGroup,
        tag: 'circle',
        selector: 'secondCircle'
      })
      .attr('cursor', 'pointer')
      .attr('r', this.sliderHandlerRadius)
      .attr('fill', this.circleColor)
      .attr('stroke', this.darkColor)
      .attr('stroke-width', 1.5)

      patternify({
        container: firstCircleGroup,
        tag: 'line',
        selector: 'vBarFirst',
        data: [-1, 0, 1]
      })
      .attr('x1', d => d * 2.5)
      .attr('x2', d => d * 2.5)
      .attr('y1', -4)
      .attr('y2', 4)
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.8)

      patternify({
        container: secondCircleGroup,
        tag: 'line',
        selector: 'vBarSecond',
        data: [-1, 0, 1]
      })
      .attr('x1', d => d * 2.5)
      .attr('x2', d => d * 2.5)
      .attr('y1', -4)
      .attr('y2', 4)
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.8)

      // drag handlers
      function dragged (d, flag) {
        var cx = getDragCoord()
        if (flag === 'first') {
          if (cx > currentSelectedArea[1] - self.sliderScale.bandwidth() * self.maximumSliderRange) {
            cx = currentSelectedArea[1] - self.sliderScale.bandwidth() * self.maximumSliderRange
          }
          currentSelectedArea[0] = cx
          firstCircleGroup.attr('transform', `translate(${currentSelectedArea[0]})`)
          foregroundLine.attr('x1', cx)
        } else {
          if (cx < currentSelectedArea[0] + self.sliderScale.bandwidth() * self.maximumSliderRange) {
            cx = currentSelectedArea[0] + self.sliderScale.bandwidth() * self.maximumSliderRange
          }
          currentSelectedArea[1] = cx
          secondCircleGroup.attr('transform', `translate(${currentSelectedArea[1]})`)
          foregroundLine.attr('x2', cx)
        }

        dragEnd()
      }

      function dragEnd () {
        self.zoomArea = currentSelectedArea
        let newDomain = getNewDomain()
        self.domain = newDomain
        self.drawAxis()
        self.adjustAxis()
      }

      function getNewDomain () {
        return getLiveDomain(currentSelectedArea)
      }

      function getLiveDomain (coords) {
        let sliderBandWidth = self.sliderScale.bandwidth()
        let f = Math.round(coords[0] / sliderBandWidth)
        let s = Math.round(coords[1] / sliderBandWidth)
        return self.$d3.range(self.staticDomain[f], self.staticDomain[s - 1] + 1)
      }

      function getDragCoord () {
        let cx = self.$d3.event.x
        if (cx < 0) {
          cx = 0
        } else if (cx > width - padding * 2) {
          cx = width - padding * 2
        }
        return cx
      }

      let startX = 0
      function getLineDragCoords () {
        let dx = self.$d3.event.x - startX
        if (currentSelectedArea[0] + dx <= 0) {
          dx = 0 - currentSelectedArea[0]
        }
        if (currentSelectedArea[1] + dx >= width - padding * 2) {
          dx = width - padding * 2 - currentSelectedArea[1]
        }
        return [currentSelectedArea[0] + dx, currentSelectedArea[1] + dx]
      }

      function lineDragStart () {
        startX = self.$d3.event.x
      }

      function lineDrag () {
        let coords = getLineDragCoords()
        firstCircleGroup.attr('transform', `translate(${coords[0]})`)
        secondCircleGroup.attr('transform', `translate(${coords[1]})`)
        foregroundLine.attr('x1', coords[0])
                      .attr('x2', coords[1])

        let newDomain = getLiveDomain(coords)
        self.domain = newDomain
        self.drawAxis()
        self.adjustAxis()
      }

      function lineDragEnd () {
        let coords = getLineDragCoords()
        currentSelectedArea[0] = coords[0]
        currentSelectedArea[1] = coords[1]
        self.zoomArea = currentSelectedArea
        startX = 0
      }

      function lineMouseOver () {
        let that = self.$d3.select(this)
        that
            .transition()
            .duration(250)
            .attr('stroke-width', 7)
      }

      function lineMouseOut () {
        let that = self.$d3.select(this)
        that
            .transition()
            .duration(250)
            .attr('stroke-width', 3)
      }
    },
    setWidth () {
      this.width = this.$el.offsetWidth
    },
    setDomain () {
      let min = this.$d3.min(this.computedData, d => d.year)
      let max = this.$d3.max(this.computedData, d => d.year)
      this.staticDomain = this.$d3.range(min, max + 1)
      if (!this.domain.length) {
        this.domain = this.$d3.range(min, min + this.maximumSliderRange + 1)
      }
    },
    onResize () {
      this.setWidth()
      this.drawAxis()
      this.adjustAxis()
      this.zoomArea = [this.sliderScale(this.domain[0]), this.sliderScale(this.domain[this.domain.length - 1]) + this.sliderScale.bandwidth()]
      this.drawSlider(this.$d3.select('g.slider-wrapper'), this.sliderWidth)
    }
  },
  watch: {
    computedData () {
      this.setDomain()
      this.drawAxis()
      this.adjustAxis()
      this.drawSlider(this.$d3.select('g.slider-wrapper'), this.sliderWidth)
    }
  },
  mounted () {
    this.chart = this.$d3.select('#barChartRent g')
    this.setDomain()
    this.onResize()
    this.$d3.select(window).on('resize', this.onResize)
  },
  components: {
    Tooltip
  }
}
</script>

<style lang="scss">

    .chart-wrapper {
        width: 100%;
        margin: 0px;
        padding: 0px;
        font-family: Roboto;
        svg {
            // background: linear-gradient(193.11deg, #685B7A 0%, #445B7C 100%);
            box-shadow: 20px 22px 44px 0 rgba(82,86,112,0.55);
            text {
              font-family: Roboto;
            }
            #hoverrect {
              display: none;
              pointer-events: none;
            }
            .hiddenrect {
              fill: transparent;
            }
            .yAxis text {
              fill: #fff;
            }
            .yAxis line {
              stroke: #A5ADBA;
            }
            .secondaryAxisText {
              fill: #fff;
            }
            .axis  {
              pointer-events: none;
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
              font-family: Roboto;
              .income-span {
                width: 30px;
                height: 8px;
                display: inline-block;
                background-color: #FAC604;
                border-radius: 4px;
              }
              .year {
                color: #737373;
                font-size: 16px;
                line-height: 24px;
              }
              .label-span {
                	color: #84888F;
                  font-size: 14px;
                  line-height: 20px;
              }
              .amount-span {
                color: #232B36;
                font-family: Roboto;
                font-size: 14px;
                font-weight: 500;
                line-height: 20px;
              }
              .tooltip-right {
                float: right;
              }
            }
        }
    }

</style>

