var common = require('./common')
var libxml = require('libxmljs')

module.exports = (html) => {
  var body = common.slim(html)
  var leadSection = body.child(0)

  titlify(body)

  removeRefLinks(leadSection)

  return common.toJson(body)
}

/**
 * Removes all but the heading elements all non-lead sections, i.e. convert
 *
 * ```html
 * <section>
 *   <p>This is the lead section</p>
 * </section>
 * <section>
 *   <h2>First section</h2>
 *   <p>This is the first section</p>
 * </section>
 * ```
 *
 * to
 *
 * ```html
 * <section>
 *   <p>This is the lead section</p>
 * </section>
 * <section>
 *   <h2>First section</h2>
 * </section>
 * ```
 *
 * `body`: `libxml.Element`
 */
function titlify (body) {
  var sections = body.childNodes()
  var i
  var title
  var doc = body.doc()
  var section

  for (i = 1; i < sections.length; ++i) {
    title = sections[i].child(0).text()

    section = new libxml.Element(doc, 'section')
    section.node('h2', title)

    sections[i].replace(section)
  }
}

function removeRefLinks (el) {
  // TODO: Reinstate ref links in the lead section once per-section reference
  // extraction is working.
  common.removeAll(el.find('//*[@typeof="mw:Extension/ref"]'))
}
