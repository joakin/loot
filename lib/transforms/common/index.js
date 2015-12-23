var libxml = require('libxmljs')

exports.slim = (doc) => {
  preProcess(doc)

  sectionify(doc)
  imagify(doc)

  postProcess(doc)
  return doc
}

/**
 * Remove all styles, links to stylesheets, comments, and images before
 * splitting the body of the document into sections (see `sectionify`).
 *
 * `doc`: `libxml.Document`
 */
function preProcess (doc) {
  removeAll(doc.find('//style'))
  removeAll(doc.find('//link[@rel="stylesheet"]'))

  removeAll(doc.find('//comment()'))

  removeAmbox(doc)

  removeNavbox(doc)
}

/**
 * Remove all `data-mw` attributes as no further processing that might require
 * them is taking place.
 *
 * `doc`: `libxml.Document`
 */
function postProcess (doc) {
  removeDataMw(doc)
}

function removeAmbox (doc) {
  removeAll(doc.find('//table[contains(concat(" ", @class, " "), " ambox ")]'))
}
exports.removeAmbox = removeAmbox

function removeNavbox (doc) {
  removeAll(doc.find('//table[contains(concat(" ", @class, " "), " navbox ")]'))
}
exports.removeNavbox = removeNavbox

function removeDataMw (doc) {
  removeAllAttributes(doc.find('//*[@data-mw]'), 'data-mw')
}
exports.removeDataMw = removeDataMw

function removeExtraneousMarkup (doc) {
  removeExtraneousElements(doc)

  removeAllAttributes(doc.find('//*[@typeof]'), 'typeof')
  removeAllAttributes(doc.find('//*[@rel="mw:WikiLink"]'), 'rel')

  // Remove all Parsoid-generated IDs, which will always be 4+ characters and of the form
  // mwAB[CDE...].
  removeAllAttributes(doc.find('//*[starts-with(@id, "mw")]'), 'id')

  // Scope this expression to the body element as we process elements within the head element for
  // meta information, e.g. in `toJson` below.
  removeAllAttributes(doc.find('//body//*[@about]'), 'about')
}
exports.removeExtraneousMarkup = removeExtraneousMarkup

/**
 * For now, removes `span` elements that typicaly only contain a single space but have an additional
 * `typeof="mw:Entity"` attribute.
 */
function removeExtraneousElements (doc) {
  var i
  var nodes = doc.find('//*[@typeof="mw:Entity"]')
  var node

  for (i = 0; i < nodes.length; ++i) {
    node = nodes[i]
    node.replace(node.text())
  }
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
    nodes[i].attr(attribute).remove()
  }
}

/**
 * Rewrite all `img` elements:
 *
 * - As `span` elements if their parent is an `a`
 * - As `a` elements if their parent is not an `a`
 * - Add the file name as text for the rewritten image
 * - Set the href of the link to the full image
 *
 * `doc`: `libxml.Document`
 */
function imagify (doc) {
  var nodes = doc.find('//img')
  var i

  for (i = 0; i < nodes.length; ++i) {
    try {
      var img = nodes[i]
      var parent = img.parent()
      // The image wrapper will be a link if the parent is not
      var wrapperName = parent.name() === 'a' ? 'span' : 'a'
      // The text of the wrapper is the file name
      var wrapperText = (img.attr('resource') || img.attr('src')).value()
      // Add the wrapper to the parent of the image
      var wrapper = parent.node(wrapperName, wrapperText)

      wrapper.attr({
        // Set href to link to image for html-only
        href: img.attr('src').value(),
        // Set attribute with original markup
        'data-replace-with': img.toString(),
        // Set class to make it searchable on the DOM
        class: 'LootTransformedImage',
        // Set styles to fix it's size and avoid reflows when lazy loading
        style: [
          'display: inline-block;',
          `width: ${img.attr('width').value()}px;`,
          `height: ${img.attr('height').value()}px;`,
          'overflow: hidden'
        ].join('')
      })

      // Get rid of original image in the document
      img.remove()
    } catch (e) {
      console.log(img.toString(), '\n', e.stack)
    }
  }
}
exports.imagify = imagify

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

exports.toJson = (doc) => {
  var modifier = doc.find('//meta[@property="dc:title"]')[0]
  var id = modifier.attr('about').value().split('/')[1]
  return JSON.stringify({
    lastmodified: {
      by: {
        isAnonymous: id === '0',
        name: modifier.attr('content').value()
      },
      at: doc.find('//meta[@property="dc:modified"]')[0].attr('content').value()
    },
    sections: prepareSections(doc.get('body').childNodes())
  })
}

function prepareSections (sections) {
  var i
  var results = []
  var section
  var node
  var title

  for (i = 0; i < sections.length; ++i) {
    section = sections[i]
    title = ''
    node = section.get('h2')

    if (node) {
      title = node.text()

      node.remove()
    }

    results.push({
      title: title,
      content: innerHTML(section)
    })
  }

  return results
}

function innerHTML (node) {
  return node.childNodes()
    .map((n) => n.toString())
    .join('\n')
}
