var getWikipediaHTML = require('../../net/wikipedia')
var handleError = require('../common').handleError
var libxml = require('libxmljs')
var url = require('url')
var util = require('./transform-handler-utils')

var allTransforms = require('../../transforms/common')
var benchmarkTransforms = require('../../transforms/benchmarks')
var TRANSFORMS = {
  noambox: allTransforms.removeAmbox,
  nonavbox: allTransforms.removeNavbox,
  noreferences: benchmarkTransforms.removeReferences
}
var DEFAULT_TRANSFORMS = []

module.exports = function (req, res, match, cache) {
  var title = match.params.title

  var query = url.parse(req.url, true).query
  var transforms = util.getTransforms(query, TRANSFORMS)
  var transform = util.createTransform(transforms, TRANSFORMS, DEFAULT_TRANSFORMS)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  cache(util.cacheKey(match, transforms), function (isCacheHit, entry, write) {
    if (isCacheHit) {
      entry.read().pipe(res)

      return
    }

    var handler = (wpResponse) => {
      var doc = libxml.parseHtmlString(wpResponse)
      var transformed = transform(doc).toString()
      res.end(transformed)
      write().end(transformed)
    }

    getWikipediaHTML(title)
      .then(handler)
      .catch((e) => handleError(res, e))
  })
}
