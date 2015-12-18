var concat = require('concat-stream')
var getRestbaseHtml = require('../../net/restbase')
var handleError = require('../common').handleError
var libxml = require('libxmljs')
var url = require('url')
var baseCacheKey = require('../common').cacheKey

var allTransforms = require('../../transforms/common')
var benchmarkTransforms = require('../../transforms/benchmarks')
var TRANSFORMS = {
  noambox: allTransforms.removeAmbox,
  nonavbox: allTransforms.removeNavbox,
  noimages: allTransforms.imagify,
  nodatamw: allTransforms.removeDataMw,
  noreferences: benchmarkTransforms.removeReferences
}

function getTransforms (query) {
  if (!query.transforms) {
    return []
  }

  var validTransforms = Object.keys(TRANSFORMS)
  var transforms = query.transforms.split('|')

  // validTransforms is a fixed length whereas transforms is bounded by the maximum length of a URL
  // that can be sent by a browser.
  return validTransforms.filter(
    (transform) => transforms.indexOf(transform) !== -1
  )
}

function createTransform (transforms) {
  // i.e. /benchmarks/loot/:title, /benchmarks/loot/:title?transforms= will fall back to the default
  // transform.
  if (transforms.length === 0) {
    return allTransforms.slim
  }

  return function (doc) {
    transforms.forEach((transform) => TRANSFORMS[transform](doc))

    return doc
  }
}

function cacheKey (match, transforms) {
  var suffix = transforms.join('|')

  return baseCacheKey(match) + suffix
}

module.exports = function (req, res, match, cache) {
  var title = match.params.title

  var query = url.parse(req.url, true).query
  var transforms = getTransforms(query)
  var transform = createTransform(transforms)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  cache(cacheKey(match, transforms), function (isCacheHit, reader, writer) {
    if (isCacheHit) {
      reader.pipe(res)

      return
    }

    var handler = (restRes) => {
      restRes.pipe(concat((contents) => {
        var doc = libxml.parseHtmlString(contents)
        var transformed = transform(doc).toString()
        res.end(transformed)
        writer.end(transformed)
      }))
    }

    getRestbaseHtml(title)
      .then(handler)
      .catch((e) => handleError(res, e))
  })
}
