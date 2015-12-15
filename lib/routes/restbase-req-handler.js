var fs = require('fs')
var concat = require('concat-stream')
var getRestbaseHtml = require('../net/restbase')
var checkCache = require('../cache')
var handleError = require('./common').handleError
var libxml = require('libxmljs')

// Creates a request handler function that will return parsoid html either from
// the cache or the restbase service applying the specified `transform`.
//
// `transform`: Stream -> Stream
module.exports = function (transform) {
  return function (req, res, match) {
    var title = match.params.title

    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    checkCache(match.route, title, function (err, cachePath) {
      // Cache miss
      if (err) {
        var handler = (restRes) => {
          restRes.pipe(concat((contents) => {
            var doc = libxml.parseHtmlString(contents)
            // Handle redirect
            var redirect = doc.find('//link[@rel="mw:PageProp\/redirect"]')[0]
            if (redirect) {
              // Make subsequent request
              getRestbaseHtml(redirect.attr('href').value().slice(2))
                .then(handler)
                .catch((e) => handleError(res, e))
            } else {
              var transformed = transform(doc)
              res.end(transformed)
              fs.writeFile(cachePath, transformed)
            }
          }))
        }

        getRestbaseHtml(title)
          .then(handler)
          .catch((e) => handleError(res, e))
      } else {
        fs.createReadStream(cachePath).pipe(res)
      }
    })
  }
}
