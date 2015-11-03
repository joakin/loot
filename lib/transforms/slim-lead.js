var common = require('./common')

module.exports = (html) =>
  common.slim(html)
    .child(0)
    .toString()
