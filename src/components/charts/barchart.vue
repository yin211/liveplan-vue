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
                      :fill="barColor">
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
                    :stroke="divisionLineColor"
                    stroke-width="0.5">
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
import { patternify } from './helpers'
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
      divisionLineColor: '#2c3468',
      barColor: '#FEC600',
      sliderBackColor: '#636e7f',
      circleColor: '#1971ff',
      darkColor: '#A5ADBA',
      sliderHandlerRadius: 12,
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
      if (d.year >= this.domain[this.domain.length - 6]) {
        x -= 270
      }
      let xTick = this.chart.select(`#xTick-${d.year}`)
      let xTickCircle = xTick.select('circle')
      xTickCircle.attr('fill', '#fff')
                  .attr('stroke', '#1971ff')
      let xTickYear = xTick.select('.tick-year')
      xTickYear.attr('fill', '#fff')
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
      let xTick = this.chart.select(`#xTick-${d.year}`)
      let xTickCircle = xTick.select('circle')
      xTickCircle.attr('fill', '#1971ff')
                  .attr('stroke', '#fff')
      let xTickYear = xTick.select('.tick-year')
      xTickYear.attr('fill', this.darkColor)
      let hoverrect = this.$d3.select('#hoverrect')
      hoverrect.style('display', 'none')
      this.tooltipVisible = false
    },
    drawAxis () {
      let tickSize = this.chartHeight
      let xAxis = this.$d3.axisBottom(this.xScale).tickSize(-(tickSize))
      let yAxis = this.$d3.axisLeft(this.yScale).ticks(5)

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

      // reposition texts within the axis
      ticks.select('text')
           .attr('class', 'tick-year')
           .attr('dy', '4em')
           .attr('fill', this.darkColor)

      // append circles
      patternify({
        container: ticks,
        tag: 'circle',
        selector: 'tickCircle'
      })
      .attr('r', 5)
      .attr('fill', this.circleColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)

      // append ages
      patternify({
        container: ticks,
        tag: 'text',
        selector: 'secondaryAxisText'
      })
      .attr('class', 'secondaryAxisText')
      .attr('dy', '2.5em')
      .text(function (d, i) {
        let tick = self.$d3.select(this.parentElement)
        return tick.attr('data-age')
      })

      if (this.startYear >= this.domain[0]) {
        // start year tick selection
        let startYearTick = this.chart.select(`#xTick-${this.startYear}`)
        startYearTick
          .select('line')
          .attr('y2', startEndTickSize)

        // append circle for the startYear tick
        patternify({
          container: startYearTick,
          tag: 'circle',
          selector: 'startYearCircle'
        })
        .attr('r', 5)
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

        patternify({
          container: startYearGroup,
          tag: 'text',
          selector: 'startYearY'
        })
        .text(this.startYear)
        .attr('fill', '#fff')
        .attr('dy', 20)
      } else {
        this.chart.selectAll('g.startYear').remove()
      }

      if (this.endYear <= this.domain[this.domain.length - 1]) {
        // end year tick selection
        let endYeartTick = this.chart.select(`#xTick-${this.endYear}`)
        endYeartTick
          .select('line')
          .attr('y2', startEndTickSize)

        // add circle to the end year tick
        patternify({
          container: endYeartTick,
          tag: 'circle',
          selector: 'endYearCircle'
        })
        .attr('r', 5)
        .attr('fill', '#1971ff')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('transform', `translate(0, ${startEndTickSize})`)

        // end year text group
        let endYearGroup = patternify({
          container: this.chart,
          tag: 'g',
          selector: 'endYear'
        })
        .attr('transform', `translate(${this.xScale(this.endYear) + this.xScale.bandwidth() / 2 + 10}, ${this.mehrHeight - this.margin.top - 15})`)

        patternify({
          container: endYearGroup,
          tag: 'text',
          selector: 'endYearTxt'
        })
        .text('End Year')
        .attr('fill', this.darkColor)
        .attr('font-size', '0.8rem')

        patternify({
          container: endYearGroup,
          tag: 'text',
          selector: 'endYearY'
        })
        .text(this.endYear)
        .attr('fill', '#fff')
        .attr('dy', 20)
      } else {
        this.chart.selectAll('g.endYear').remove()
      }
    },
    drawSlider (selection, width) {
      var padding = 60
      var self = this
      var scale = this.$d3
                  .scaleBand()
                  .domain(this.staticDomain)
                  .range([0, width - padding * 2])
      var currentSelectedArea = [scale(this.domain[0]), scale(this.domain[this.domain.length - 1]) + scale.bandwidth()]
      // append texts
      patternify({
        container: selection,
        tag: 'text',
        selector: 'sliderStartTxt'
      })
      .text(this.staticDomain[0])
      .attr('fill', '#fff')

      patternify({
        container: selection,
        tag: 'text',
        selector: 'sliderEndTxt'
      })
      .text(this.staticDomain[this.staticDomain.length - 1])
      .attr('fill', '#fff')
      .attr('x', width - 35)

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
              })
              .on('end', d => {
                return dragEnd(d)
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
              })
              .on('end', d => {
                return dragEnd(d)
              }))

      patternify({
        container: firstCircleGroup,
        tag: 'circle',
        selector: 'firstCircle'
      })
      .attr('cursor', 'pointer')
      .attr('r', this.sliderHandlerRadius)
      .attr('fill', this.circleColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)

      patternify({
        container: secondCircleGroup,
        tag: 'circle',
        selector: 'secondCircle'
      })
      .attr('cursor', 'pointer')
      .attr('r', this.sliderHandlerRadius)
      .attr('fill', this.circleColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)

      patternify({
        container: firstCircleGroup,
        tag: 'line',
        selector: 'vBarFirst',
        data: [-1, 0, 1]
      })
      .attr('x1', d => d * 3)
      .attr('x2', d => d * 3)
      .attr('y1', -4)
      .attr('y2', 4)
      .attr('stroke', '#fff')

      patternify({
        container: secondCircleGroup,
        tag: 'line',
        selector: 'vBarSecond',
        data: [-1, 0, 1]
      })
      .attr('x1', d => d * 3)
      .attr('x2', d => d * 3)
      .attr('y1', -4)
      .attr('y2', 4)
      .attr('stroke', '#fff')

      // drag handlers
      function dragged (d, flag) {
        var cx = getDragCoord()
        if (flag === 'first') {
          if (cx > currentSelectedArea[1] - scale.bandwidth() * self.maximumSliderRange) {
            cx = currentSelectedArea[1] - scale.bandwidth() * self.maximumSliderRange
          }
          currentSelectedArea[0] = cx
          firstCircleGroup.attr('transform', `translate(${currentSelectedArea[0]})`)
          foregroundLine.attr('x1', cx)
        } else {
          if (cx < currentSelectedArea[0] + scale.bandwidth() * self.maximumSliderRange) {
            cx = currentSelectedArea[0] + scale.bandwidth() * self.maximumSliderRange
          }
          currentSelectedArea[1] = cx
          secondCircleGroup.attr('transform', `translate(${currentSelectedArea[1]})`)
          foregroundLine.attr('x2', cx)
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
      }

      function lineDragEnd () {
        let coords = getLineDragCoords()
        currentSelectedArea[0] = coords[0]
        currentSelectedArea[1] = coords[1]
        let newDomain = getNewDomain()
        self.domain = newDomain
        self.drawAxis()
        self.adjustAxis()
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
        if (startX === 0) {
          let that = self.$d3.select(this)
          that
              .transition()
              .duration(250)
              .attr('stroke-width', 3)
        }
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
            .yAxis text {
                fill: #fff;
            }
            .secondaryAxisText {
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

