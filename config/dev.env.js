var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //ROOT_API: '"http://api.livsplan.test/api/v1"'
  ROOT_API: '"https://api.livsplan.se/api/v1"'
})
