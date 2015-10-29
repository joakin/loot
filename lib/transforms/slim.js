var libxml = require('libxmljs')

module.exports = (html) => {
  var doc = libxml.parseHtmlString(html)

  removeAll(doc.find('//img'))
  removeAll(doc.find('//table'))

  removeAll(doc.find('//style'))
  removeAll(doc.find('//link[@rel="stylesheet"]'))

  removeAll(doc.find('//*[@typeof="mw:Extension/references"]'))

  removeAllAttributes(doc.find('//*[@data-mw]'), 'data-mw')

  removeAll(doc.find('//comment()'))

  return doc.toString()
}

function removeAll (nodes) {
  var i

  for (i = 0; i < nodes.length; ++i) {
    nodes[i].remove()
  }
}

function removeAllAttributes (nodes, attribute) {
  var i

  for (i = 0; i < nodes.length; ++i) {
    // FIXME: Attribute#remove isn't documented.
    nodes[i].attr(attribute).remove()
  }
}
