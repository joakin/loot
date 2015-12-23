var concat = require('concat-stream')
var getRestbaseHtml = require('../net/restbase')
var handleError = require('./common').handleError
var libxml = require('libxmljs')
var cacheKey = require('./common').cacheKey

// Creates a request handler function that will return parsoid html either from
// the cache or the restbase service applying the specified `transform`.
//
// `transform`: Stream -> Stream
module.exports = function (transform) {
  return function (req, res, match, cache) {
    var title = match.params.title

    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    cache(cacheKey(match), function (isCacheHit, entry, write) {
      if (isCacheHit) {
        entry.read().pipe(res)

        return
      }

      var handler = (restRes) => {
        restRes.pipe(concat((contents) => {
          var doc = libxml.parseHtmlString(contents)
          // Handle redirect
          var redirect = doc.find('//link[@rel="mw:PageProp/redirect"]')[0]
          if (redirect) {
            var redirectTitle = redirect.attr('href').value().slice(2)
            res.writeHead(301, { Location: redirectTitle })
            res.end()
          } else {
            var transformed = transform(doc)
            res.end(transformed)
            write().end(transformed)
          }
        }))
      }

      getRestbaseHtml(title)
        .then(handler)
        .catch((e) => handleError(res, e))
    })
  }
}
