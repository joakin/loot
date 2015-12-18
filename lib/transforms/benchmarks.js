var removeAll = require('./common').removeAll

exports.removeReferences = function removeReferences (doc) {
  removeAll(doc.find(
    '//*[contains(concat(" ", normalize-space(./@class), " "), " reflist ")] | .//*[contains(concat(" ", normalize-space(./@class), " "), " refbegin ")]'
  ))

  removeAll(doc.find('//*[@typeof="mw:Extension/ref"]'))
}
