var trumpet = require('trumpet')
var removeImages = require('../transforms/remove-images.js')
var removeTables = require('../transforms/remove-tables.js')
var removeDataMW = require('../transforms/remove-datamw.js')
var removeStyles = require('../transforms/remove-styles.js')
var removeReferences = require('../transforms/remove-references.js')

module.exports = require('./restbase-req-handler.js')(slim)

function slim (res) {
  var stream = trumpet()
  removeImages(stream)
  removeTables(stream)
  removeDataMW(stream)
  removeStyles(stream)
  removeReferences(stream)
  res.pipe(stream)
  return stream
}
