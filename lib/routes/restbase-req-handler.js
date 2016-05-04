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
      var opts = {
        headers: isCacheHit ? {
          'If-None-Match': entry.meta.etag
        } : {}
      }

      getRestbaseHtml(title, opts).then((restRes) => {
        if (isCacheHit && restRes.statusCode === 304) {
          entry.read().pipe(res)
          return
        }

        if (restRes.statusCode === 301) {
          res.writeHead(301, { Location: restRes.headers.location })
          res.end()
          return
        }

        restRes.pipe(concat((contents) => {
          var doc = libxml.parseHtmlString(contents.toString('utf-8'))
          // Handle redirect
          var redirect = doc.find('//link[@rel="mw:PageProp/redirect"]')[0]
          if (redirect) {
            var redirectTitle = redirect.attr('href').value().slice(2)
            res.writeHead(301, { Location: redirectTitle })
            res.end()
          } else {
            var transformed = transform(doc)
            res.end(transformed)
            write({ etag: restRes.headers.etag }).end(transformed)
          }
        }))
      }).catch((e) => {
        // If restbase 404s, grab from cache if possible
        if (e.code === 'ENOTFOUND' && isCacheHit) entry.read().pipe(res)
        else handleError(res, e)
      })
    })
  }
}
