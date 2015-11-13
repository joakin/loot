var common = require('./common')

module.exports = (html) => {
  var body = common.slim(html)
  var leadSection = body.child(0)

  removeNonLeadSections(body)
  removeRefLinks(leadSection)

  return common.toJson(body)
}

function removeNonLeadSections (body) {
  var nodes = body.childNodes()
  var i

  for (i = 1; i < nodes.length; ++i) {
    nodes[i].remove()
  }
}

function removeRefLinks (el) {
  // TODO: Reinstate ref links in the lead section once per-section reference
  // extraction is working.
  common.removeAll(el.find('//*[@typeof="mw:Extension/ref"]'))
}
