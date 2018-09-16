<template>
  <div class="chart-wrapper">
    <svg :width="width"
         :height="height">
            <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse"
                x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"  stop-color="rgba(0, 101, 255, 0.8)" />
                <stop offset="100%" stop-color="rgba(87, 91, 122, 0)" />
            </linearGradient>
            <g :transform="`translate(${padding.left}, ${padding.top})`" class="chart-stack"></g>
            <g :transform="`translate(${padding.left}, ${padding.top})`" class="chart"></g>
            <line :x1="0"
                    :x2="width"
                    :y1="padding.top + chartHeight + hoverrectMehrYBottom"
                    :y2="padding.top + chartHeight + hoverrectMehrYBottom"
                    :stroke="divisionLineColor"
                    stroke-width="0.5">
            </line>
            <g :transform="`translate(${sliderMarginLeft}, ${padding.top + chartHeight + hoverrectMehrYBottom + 35})`" class="slider-wrapper"></g>
            <Tooltip :svgWidth="width"
                     :svgHeight="height"
                     :obj="tooltipObj"
                     :handleOverflow="true">
            </Tooltip>
    </svg>
  </div>
</template>

<script>
import Tooltip from './d3-assets/Tooltip'
import patternify from './d3-assets/patternify'
export default {
  props: ['dataObject', 'birthYear'],
  components: {
    Tooltip
  },
  data () {
    return {
      width: 0,
      height: 550,
      padding: {
        left: 110,
        right: 15,
        top: 35,
        bottom: 15
      },
      sliderHeight: 180,
      hoverrectMehrYBottom: 60,
      mehrHeight: 60,
      axisCircleSize: 4,
      divisionLineColor: '#404A65',
      colors: {
        surplus: '#FEC600',
        shortfall: '#D90060'
      },
      barColors: [
        '#FEC600',
        '#EE00F7',
        '#00DEFB',
        '#F2006B',
        '#FFF0B2',
        '#FFBDAD',
        '#A5ADBA'
      ],
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
      svg: null,
      chart: null
    }
  },
  computed: {
    dataArray () {
      return this.dataObject.income[0]
    },
    tooltipData () {
      return this.domain.map(year => {
        let sum = 0
        this.dataObject.income.forEach(d => {
          let yearIncome = d.filter(x => x.year === year)
          if (yearIncome.length) {
            sum += yearIncome[0].value
          }
        })
        let expense = 0
        this.dataObject.expense.forEach(d => {
          let yearExpense = d.filter(x => x.year === year)
          if (yearExpense.length) {
            expense += yearExpense[0].value
          }
        })
        return {
          year: year,
          incomes: sum,
          expenses: expense
        }
      })
    },
    computedData () {
      let cont = []

      for (let i = this.domain[0]; i <= this.domain[this.domain.length - 1]; i++) {
        let dt = {
          year: i
        }
        this.dataObject.income.forEach(d => {
          let y = d.filter(x => x.year === i)
          dt[d.object_subtype] = y.length ? y[0].value : 0
        })
        cont.push(dt)
      }
      return cont
    },
    bars () {
      return this.$d3.stack()
        .order(this.$d3.stackOrderDescending)
        .keys(this.dataObject.income.map(x => x.object_subtype))(this.computedData)
    },
    chartHeight () {
      return this.height - this.padding.top - this.padding.bottom - this.sliderHeight
    },
    chartWidth () {
      return this.width - this.padding.left - this.padding.right
    },
    maximumSliderRange () {
      return Math.round(this.dataArray.length / 2.5)
    },
    sliderMarginLeft () {
      return (this.width - document.getElementsByClassName('income-table')[0].clientWidth) / 2
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
      const min = this.$d3.min(this.bars[0], d => (Array.isArray(d) && d.length === 2) ? d[0] : 0)
      const max = this.$d3.max(this.bars[this.bars.length - 1], d => (Array.isArray(d) && d.length === 2) ? d[1] : 0)

      return this.$d3.scaleLinear()
              .domain([min, max])
              .range([this.chartHeight, 0])
    },
    lineGenerator () {
      return this.$d3.line()
              .x(d => this.xScale(d.year))
              .y(d => this.yScale(d.value))
    },
    areaGenerator () {
      return this.$d3.area()
              .x(d => this.xScale(d.year))
              .y0(this.yScale(this.yScale.domain()[0]))
              .y1(d => this.yScale(d.value))
    },
    lines () {
      return this.dataObject.expense.map(d => d.filter(x => this.domain.indexOf(x.year) > -1))
    }
  },
  methods: {
    colorScale (i) {
      return this.barColors[i % this.barColors.length]
    },
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
                    <div class="d-flex justify-content-between mt-2">
                      <div class="mr-3">
                        <span class="tooltip-amount-span" style="background-color: #FAC604;"></span><span class="ml-2 label-span">Total income:</span>
                      </div>
                      <div class="ml-4">
                        <strong><span id="amount-span">${this.thousandsFormat(d.incomes)}</span> SEK</strong>
                      </div>
                    </div>
                    <div class="d-flex justify-content-between mt-2">
                      <div class="mr-3">
                        <span class="tooltip-expense-span"></span><span class="ml-2 label-span">Expenses:</span>
                      </div>
                      <div class="ml-4">
                        <strong><span id="amount-span">${this.thousandsFormat(d.expenses)}</span> SEK</strong>
                      </div>
                    </div>
                  </div>`

      let x = this.xScale(d.year) + this.xScale.bandwidth() / 2 + this.padding.left
      let y = this.padding.top * 1.5

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
      this.$d3.select('#hoverrect').style('display', 'none')

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
    drawChart () {
      // bars
      let stacks = patternify({
        tag: 'g',
        selector: 'stack-group',
        container: this.chartStack,
        data: this.bars
      })
      .attr('fill', d => this.colorScale(d.index))

      patternify({
        tag: 'rect',
        selector: 'stack-rect',
        container: stacks,
        data: d => d
      })
      .attr('height', d => this.yScale(Math.min(d[0], d[1])) - this.yScale(Math.max(d[0], d[1])))
      .attr('width', this.xScale.bandwidth())
      .attr('x', d => this.xScale(d.data.year))
      .attr('y', d => this.yScale(Math.max(d[0], d[1])))
      .attr('opacity', (d, i) => this.calcOpacity(d, i))

      // draw area
      patternify({
        tag: 'path',
        selector: 'area',
        container: this.chart,
        data: this.lines
      })
      .attr('d', this.areaGenerator)
      .attr('fill', 'url(#lineGradient)')

      // draw line
      patternify({
        tag: 'path',
        selector: 'line',
        container: this.chart,
        data: this.lines
      })
      .attr('d', this.lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

      // hidden rectangles
      patternify({
        tag: 'rect',
        selector: 'hiddenrect',
        container: this.chart,
        data: this.tooltipData
      })
      .attr('x', d => this.xScale(d.year))
      .attr('y', 0)
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.chartHeight + this.hoverrectMehrYBottom)
      .attr('data-year', d => d.year)
      .attr('opacity', (d, i) => this.calcOpacity(d, i))
      .on('mouseover', (d, i) => this.rectmouseover(d, i))
      .on('mouseout', (d, i) => this.rectmouseout(d, i))

      // hover rectangle
      patternify({
        tag: 'rect',
        selector: 'hoverrect',
        container: this.chart
      })
      .attr('id', 'hoverrect')
      .attr('opacity', 0.35)
      .attr('fill', 'black')
      .attr('x', 0)
      .attr('y', -this.padding.top)
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.chartHeight + this.padding.top + this.hoverrectMehrYBottom)
    },
    adjustAxis () {
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
            if (d === 0) {
              return this.chartWidth
            }
            return 4
          }
          return 0
        })
        .attr('stroke', d => {
          if (d === 0) {
            return '#ffffff'
          }
          return '#A5ADBA'
        })
        .attr('stroke-width', 1.5)

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
        self.drawChart()
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
        self.drawChart()
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
    onResize () {
      this.setWidth()
      this.setDomain()
      this.draw()
    },
    setDomain () {
      let min = this.$d3.min(this.dataArray, d => d.year)
      let max = this.$d3.max(this.dataArray, d => d.year)
      this.staticDomain = this.$d3.range(min, max + 1)
      if (!this.domain.length) {
        this.domain = this.$d3.range(min, min + this.maximumSliderRange + 1)
      }
    },
    draw () {
      this.drawChart()
      this.drawAxis()
      this.adjustAxis()
      this.drawSlider(this.$d3.select('g.slider-wrapper'), this.sliderWidth)
    }
  },
  watch: {
    bars () {
      this.setDomain()
      this.draw()
    }
  },
  mounted () {
    this.svg = this.$d3.select(this.$el).select('svg')
    this.chart = this.svg.select('g.chart')
    this.chartStack = this.svg.select('g.chart-stack')
    this.$d3.select(window).on('resize', this.onResize)
    this.onResize()
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
        }
    }
    .toolTip {
      background-color: #fff;
      padding: 20px;
      text-align: left;
      font-family: Roboto;
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
      .tooltip-amount-span {
        width: 30px;
        height:  8px;
        display: inline-block;
        border-radius: 4px;
      }
      .tooltip-expense-span{
        width: 30px;
        display: inline-block;
        border-bottom: 2px dashed #0065FF;
        margin-bottom: 0.20rem;
      }
      .tooltip-right {
        float: right;
      }
    }
</style>
