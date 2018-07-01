var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  //ROOT_API: '"http://api.livsplan.test/api/v1"'
  ROOT_API: '"https://api.livsplan.se/api/v1"'
})
