var common = require('./common')

module.exports = (doc) => common.toJson(common.slim(doc))
