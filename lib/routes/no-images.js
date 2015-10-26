var trumpet = require('trumpet')
var removeImages = require('../transforms/remove-images.js')
var removeStyles = require('../transforms/remove-styles.js')

module.exports = require('./restbase-req-handler.js')(noimages)

function noimages (res) {
  var stream = trumpet()
  removeImages(stream)
  removeStyles(stream)
  res.pipe(stream)
  return stream
}
