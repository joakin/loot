var libxml = require('libxmljs')

exports.slim = (html) => {
  var doc = libxml.parseHtmlString(html)

  preprocess(doc)

  return doc.get('body')
}

/**
 * Remove all styles, links to stylesheets, comments, and images before
 * splitting the body of the document into sections (see `sectionify`).
 *
 * `doc`: `libxml.Document`
 */
function preprocess (doc) {
  removeAll(doc.find('//style'))
  removeAll(doc.find('//link[@rel="stylesheet"]'))

  removeAll(doc.find('//comment()'))

  removeAll(doc.find('//img'))

  removeAllAttributes(doc.find('//*[@data-mw]'), 'data-mw')

  sectionify(doc)
}

function removeAll (nodes) {
  var i

  for (i = 0; i < nodes.length; ++i) {
    nodes[i].remove()
  }
}
exports.removeAll = removeAll

function removeAllAttributes (nodes, attribute) {
  var i

  for (i = 0; i < nodes.length; ++i) {
    // FIXME: Attribute#remove isn't documented.
    nodes[i].attr(attribute).remove()
  }
}

/**
 * Chunks the immediate child elements of the `body` element into sections,
 * which, accordingly, are wrapped in `section` tags.
 *
 * `doc`: `libxml.Document`
 */
function sectionify (doc) {
  var body = doc.get('body')
  var sibling = body.child(0)
  var node
  var section = new libxml.Element(doc, 'section')

  while (sibling) {
    node = sibling
    sibling = sibling.nextSibling()

    // FIXME: We should guess at the rank of the heading to chunk the document
    // on.
    if (node.type() === 'element' && node.name() === 'h2') {
      // Does the current section have content?
      if (section.child(0) !== null) {
        node.addPrevSibling(section)

        section = new libxml.Element(doc, 'section')
      }
    }

    node.remove()
    section.addChild(node)
  }

  body.addChild(section)
}
