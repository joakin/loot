var libxml = require('libxmljs')
var common = require('./common')

module.exports = (html) => {
  var doc = libxml.parseHtmlString(html)

  common.preprocess(doc)

  common.removeAll(doc.find('//*[@typeof="mw:Extension/references"]'))

  return doc.get('body').childNodes().map((n) => n.toString()).join('\n')
}
