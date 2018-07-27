<template>
    <div class="chart-wrapper">
        <svg id="timelineChartRent"
             :width="width"
             :height="height">
            <g :transform="`translate(${margin.left}, ${margin.top})`" class="chart">
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
                     :handleOverflow="true">
            </Tooltip>
        </svg>
    </div>
</template>

<script>
import patternify from './d3-assets/patternify'
import Tooltip from './d3-assets/Tooltip'

export default {
  name: 'barchart',
  props: ['label', 'dataArray', 'planStartYear', 'planEndYear', 'birthYear'],
  data () {
    return {
      width: 0,
      height: 450,
      sliderHeight: 180,
      hoverrectMehrYTop: 15,
      hoverrectMehrYBottom: 60,
      mehrHeight: 60,
      axisCircleSize: 3.5,
      divisionLineColor: '#404A65',
      sliderBackColor: '#636e7f',
      circleColor: '#1971ff',
      darkColor: '#A5ADBA',
      colors: ['#00DEFB', '#EE00F7', '#FEC600'],
      sliderHandlerRadius: 12,
      opacityPercentage: 0.2,
      domain: [],
      zoomArea: [],
      tooltipObj: {
        visible: false
      },
      margin: {
        top: 100,
        right: 15,
        bottom: 15,
        left: 100
      },
      chart: '',
      debug: false
    }
  },
  computed: {
    colorScale () {
      return this.$d3.scaleOrdinal()
                .domain(this.dataArray.map(x => x.name))
                .range(this.colors)
    },
    xDomain () {
      let minStartYear = this.$d3.min(this.dataArray, d => d.start_year)
      let maxEndYear = this.$d3.max(this.dataArray, d => d.end_year)
      let startYear = minStartYear < this.planStartYear ? minStartYear : this.planStartYear
      let endYear = maxEndYear > this.planEndYear ? maxEndYear : this.planEndYear

      return this.$d3.range(startYear, endYear + 1)
    },
    yDomain () {
      return this.dataArray.map(d => d.name)
    },
    bars () {
      return this.domain.map(d => {
        return this.findAmountsForYear(d)
      })
    },
    chartHeight () {
      return this.height - this.margin.top - this.margin.bottom - this.sliderHeight
    },
    chartWidth () {
      return this.width - this.margin.left - this.margin.right
    },
    sliderWidth () {
      return this.width - 2 * this.sliderMarginLeft
    },
    sliderScale () {
      let padding = 60
      return this.$d3
                .scaleBand()
                .domain(this.xDomain)
                .range([0, this.sliderWidth - padding * 2])
    },
    xScale () {
      return this.$d3.scaleBand()
                  .domain(this.domain)
                  .range([0, this.chartWidth])
                  .paddingInner([0.05])
                  .paddingOuter([0.1])
    },
    yScale () {
      return this.$d3.scaleBand()
                  .domain(this.yDomain)
                  .range([0, this.chartHeight])
                  .paddingInner([0.05])
    },
    sliderMarginLeft () {
      return 50
    },
    maximumSliderRange () {
      return Math.round(this.xDomain.length / 2.5)
    },
    thousandsFormat () {
      let locale = this.$d3.formatLocale({
        decimal: ',',
        thousands: ' ',
        grouping: [3]
      })
      return locale.format(',')
    }
  },
  methods: {
    rectmouseover (d, i) {
      let html = `<div class="toolTip">
                    <div>
                      <strong><span id="tooltipyear">${d.year}</span></strong> ( age of <strong><span id="tooltipage">${d.year - this.birthYear}</span></strong> )
                    </div>
                    ${d.amounts.map((d, i) => {
                      return `<div class="d-flex">
                              <div class="mr-3">
                                <span class="tooltip-amount-span" style="background-color: ${this.colorScale(d.name)};"></span><span class="ml-1">${d.name}</span>
                              </div>
                              <div>
                                <strong><span id="tooltipincome">${this.thousandsFormat(d.amount)}</span> SEK</strong>
                              </div>
                            </div>`
                    }).toString().replace(/,/g, '')}

                  </div>`

      let x = this.xScale(d.year) + this.xScale.bandwidth() / 2 + this.margin.left
      let y = this.margin.top

      this.tooltipObj = {
        x: x,
        y: y,
        html: html,
        visible: true
      }

      let xTick = this.chart.select(`#xTick-${d.year}`)
      let xTickCircle = xTick.select('circle')
      xTickCircle.attr('fill', '#fff')
                  .attr('stroke', '#1971ff')
      let xTickYear = xTick.select('.tick-year')
      xTickYear.attr('fill', '#fff')
      let hoverrect = this.$d3.select('#hoverrect')
      hoverrect.attr('x', this.xScale(d.year))
               .style('display', 'block')
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
      this.tooltipObj.visible = false
    },
    calcOpacity (d, i) {
      const length = this.domain[this.domain.length - 1] - this.domain[0]
      const l = Math.round(length * this.opacityPercentage)
      const h = length - l

      let sc = this.$d3.scaleLinear()

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
    drawXAxis () {
      let tickSize = this.chartHeight
      let xAxis = this.$d3.axisBottom(this.xScale).tickSize(-(tickSize))

      // append xAxis
      patternify({
        container: this.chart,
        tag: 'g',
        selector: 'xAxis'
      })
      .attr('class', 'xAxis axis')
      .attr('transform', `translate(${0}, ${this.chartHeight})`)
      .call(xAxis)
    },
    drawYAxis () {
      let yAxis = this.$d3.axisLeft(this.yScale).tickSize(-(this.chartWidth))

      // append yAxis
      patternify({
        container: this.chart,
        tag: 'g',
        selector: 'yAxis'
      })
      .attr('class', 'yAxis axis')
      .call(yAxis)
    },
    adjustAxes () {
      let self = this
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
        .attr('stroke-dasharray', '1.5px')

      // reposition texts within the axis
      ticks.select('text')
           .attr('class', 'tick-year')
           .attr('dy', '4em')
           .attr('fill', this.darkColor)

      // append circles
      patternify({
        container: this.chart,
        tag: 'circle',
        selector: 'tickCircleX',
        data: this.domain
      })
      .attr('class', 'tickCircleX')
      .attr('cx', d => this.xScale(d) + this.xScale.bandwidth() / 2)
      .attr('cy', this.chartHeight)
      .attr('r', this.axisCircleSize)
      .attr('fill', this.circleColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('opacity', (d, i) => {
        return this.calcOpacity(d, i)
      })

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

      // adjust yAxis
      let yTicks = this.chart.select('g.yAxis')
          .selectAll('.tick')

      // reposition lines
      yTicks.select('line')
        .attr('stroke', '#727590')
        .attr('stroke-dasharray', '1.5px')

      yTicks.select('text')
        .attr('x', -19)

      // append circles
      patternify({
        container: yTicks,
        tag: 'circle',
        selector: 'tickCircleY'
      })
      .attr('class', 'tickCircleY')
      .attr('r', this.axisCircleSize)
      .attr('cx', -10)
      .attr('fill', this.darkColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
    },
    drawRects () {
      let svg = this.$d3.select(this.$el).select('svg')

      this.dataArray.forEach(function (d) {
        let name = d.name.replace(/ /g, '-').toLowerCase()
        let rectWidth
        let rectX = d.start_year < this.domain[0] ? 0 : this.xScale(d.start_year)
        if (d.end_year < this.domain[0]) {
          rectWidth = 0
        } else if (d.start_year < this.domain[0]) {
          rectWidth = this.xScale(d.end_year) - 0
        } else if (d.end_year > this.domain[this.domain.length - 1]) {
          rectWidth = this.xScale(this.domain[this.domain.length - 1]) - this.xScale(d.start_year) + this.xScale.bandwidth()
        } else {
          rectWidth = this.xScale(d.end_year) - this.xScale(d.start_year)
        }

        let firstStopX = Math.round(this.chartWidth * this.opacityPercentage)
        let lastStopX = this.chartWidth - firstStopX
        let stops = []
        let opacityCase = 0
        if (rectX < firstStopX && rectX + rectWidth > lastStopX) {
          let percent = ((firstStopX - rectX) / rectWidth) * 100
          let percent2 = ((lastStopX - rectX) / rectWidth) * 100
          stops = [0, percent, percent2, 100]
          opacityCase = 1
        } else if (rectX < firstStopX) {
          let percent = ((firstStopX - rectX) / rectWidth) * 100
          stops = [0, percent, 100]
          opacityCase = 2
        } else {
          let percent = ((lastStopX - rectX) / rectWidth) * 100
          stops = [0, percent, 100]
          opacityCase = 3
        }
        let linearGradient = patternify({
          tag: 'linearGradient',
          selector: `linear-gradient-${name}`,
          container: svg
        })
        .attr('id', `opacity-gradient-${name}`)
        .attr('x1', '0%')
        .attr('x2', '100%')
        .attr('y1', '0%')
        .attr('y2', '0%')

        patternify({
          tag: 'stop',
          selector: `gradient-stop-${name}`,
          container: linearGradient,
          data: stops
        })
        .attr('offset', d => d + '%')
        .attr('stop-color', this.colorScale(d.name))
        .attr('stop-opacity', (d, i) => {
          if (opacityCase === 1) {
            return d === 0 || d === 100 ? 0 : 1
          } else if (opacityCase === 2) {
            return d === 0 ? 0 : 1
          } else {
            return d === 100 ? 0 : 1
          }
        })
      }.bind(this))

      patternify({
        container: this.chart,
        selector: 'timeline-rect',
        tag: 'rect',
        data: this.dataArray
      })
      .attr('x', d => this.xScale(d.start_year))
      .attr('y', d => this.yScale(d.name))
      .attr('width', d => {
        if (d.end_year < this.domain[0]) {
          return 0
        }
        if (d.start_year < this.domain[0]) {
          return this.xScale(d.end_year) - 0
        }
        if (d.end_year > this.domain[this.domain.length - 1]) {
          return this.xScale(this.domain[this.domain.length - 1]) - this.xScale(d.start_year) + this.xScale.bandwidth()
        }
        return this.xScale(d.end_year) - this.xScale(d.start_year)
      })
      .attr('height', this.yScale.bandwidth())
      .attr('fill', d => `url(#opacity-gradient-${d.name.replace(/ /g, '-').toLowerCase()})`)

      patternify({
        tag: 'rect',
        selector: 'hoverrect',
        container: this.chart
      })
      .attr('id', 'hoverrect')
      .attr('x', 0)
      .attr('y', -this.hoverrectMehrYTop)
      .attr('width', this.xScale.bandwidth())
      .attr('height', this.chartHeight + this.hoverrectMehrYTop + this.hoverrectMehrYBottom)
      .attr('fill', 'black')
      .attr('opacity', 0.35)
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
      .text(this.xDomain[0])
      .attr('fill', '#fff')

      patternify({
        container: selection,
        tag: 'text',
        selector: 'sliderEndTxt'
      })
      .text(this.xDomain[this.xDomain.length - 1])
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
        self.drawXAxis()
        self.drawRects()
        self.drawYAxis()
        self.adjustAxes()
      }

      function getNewDomain () {
        return getLiveDomain(currentSelectedArea)
      }

      function getLiveDomain (coords) {
        let sliderBandWidth = self.sliderScale.bandwidth()
        let f = Math.round(coords[0] / sliderBandWidth)
        let s = Math.round(coords[1] / sliderBandWidth)
        return self.$d3.range(self.xDomain[f], self.xDomain[s - 1] + 1)
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
        self.drawXAxis()
        self.drawRects()
        self.drawYAxis()
        self.adjustAxes()
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
      let min = this.xDomain[0]
      if (!this.domain.length) {
        this.domain = this.$d3.range(min, min + this.maximumSliderRange + 1)
      }
    },
    findAmountsForYear (year) {
      let items = this.dataArray.filter(x => x.start_year <= year && x.end_year >= year)
      let amounts = []
      let total = 0
      items.forEach(d => {
        let t = d.expense_amounts.filter(x => x.year === year)
        if (t.length) {
          total += t[0].amount
          amounts.push({
            amount: t[0].amount,
            name: d.name
          })
        }
      })
      return {
        year: year,
        amounts: amounts,
        total: total
      }
    },
    onResize () {
      this.setWidth()
      this.drawXAxis()
      this.drawRects()
      this.drawYAxis()
      this.adjustAxes()
      this.zoomArea = [this.sliderScale(this.domain[0]), this.sliderScale(this.domain[this.domain.length - 1]) + this.sliderScale.bandwidth()]
      this.drawSlider(this.$d3.select(this.$el).select('g.slider-wrapper'), this.sliderWidth)
    }
  },
  watch: {
    xDomain () {
      this.setDomain()
      this.drawAxis()
      this.adjustAxes()
      this.drawSlider(this.$d3.select('g.slider-wrapper'), this.sliderWidth)
    }
  },
  mounted () {
    this.chart = this.$d3.select(this.$el).select('svg g')
    this.setDomain()
    this.onResize()
    this.$d3.select(window).on('resize', this.onResize)
    console.log(this.bars)
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
            .toolTip {
              background-color: #fff;
              padding: 20px;
              text-align: left;
              div:first-child {
                margin-bottom: 20px;
              }
              .tooltip-amount-span {
                width: 30px;
                height: 8px;
                display: inline-block;
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

