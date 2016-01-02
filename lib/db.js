var level = require('level')

module.exports = level('./cachedb', { valueEncoding: 'json' })
