var common = require('./common')

module.exports = (doc) => {
  var slimDoc = common.slim(doc)
  var body = slimDoc.get('body')
  var leadSection = body.child(0)

  removeNonLeadSections(body)
  removeRefLinks(leadSection)

  return common.toJson(slimDoc)
}

function removeNonLeadSections (body) {
  var nodes = body.childNodes()
  var i, j

  for (i = 1; i < nodes.length; ++i) {
    var children = nodes[i].childNodes()
    for (j = 1; j < children.length; ++j) {
      children[j].remove()
    }
  }
}

function removeRefLinks (el) {
  // TODO: Reinstate ref links in the lead section once per-section reference
  // extraction is working.
  common.removeAll(el.find('//*[@typeof="mw:Extension/ref"]'))
}
