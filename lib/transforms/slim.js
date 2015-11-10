var common = require('./common')

module.exports = (html) => common.toJson(common.slim(html))
