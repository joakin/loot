var trumpet = require('trumpet')
var removeImages = require('./remove-images')
var removeTables = require('./remove-tables')
var removeDataMW = require('./remove-datamw')
var removeStyles = require('./remove-styles')
var removeReferences = require('./remove-references')

module.exports = (html) => {
  var t = trumpet()
  html.pipe(t)

  removeImages(t)
  removeTables(t)
  removeDataMW(t)
  removeStyles(t)
  removeReferences(t)

  return t
}
