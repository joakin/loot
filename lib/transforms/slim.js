var libxml = require('libxmljs')

module.exports = (html) => {
  var doc = libxml.parseHtmlString(html)

  // removeImages
  removeAll(doc.find('//img'))

  // removeTables
  removeAll(doc.find('//table'))

  // removeStyles
  removeAll(doc.find('//style'))
  removeAll(doc.find('//link[@rel="stylesheet"]'))

  // removeReferences
  removeAll(doc.find('//*[@typeof="mw:Extension/references"]'))

  return doc.toString()
}

function removeAll (nodes) {
  var i

  for (i = 0; i < nodes.length; ++i) {
    nodes[i].remove()
  }
}
