var common = require('./common')

module.exports = (html) => {
  var leadSection = common.slim(html).child(0)

  removeRefLinks(leadSection)

  return leadSection.toString()
}

function removeRefLinks (el) {
  removeAll(el.find('//*[@typeof="mw:Extension/ref"]'))
}
