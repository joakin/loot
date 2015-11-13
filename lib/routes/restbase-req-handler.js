var fs = require('fs')
var concat = require('concat-stream')
var getRestbaseHtml = require('../net/restbase')
var checkCache = require('../cache')

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
        getRestbaseHtml(title)
          .then((restRes) => {
            restRes.pipe(concat((contents) => {
              var transformed = transform(contents)
              res.end(transformed)
              fs.writeFile(cachePath, transformed)
            }))
          })
          .catch((e) => {
            res.statusCode = 500
            res.end(JSON.stringify({
              error: {
                message: e.message
              }
            }))
          })
      } else {
        fs.createReadStream(cachePath).pipe(res)
      }
    })
  }
}
