var fs = require('fs')
var getRestbaseHtml = require('../net/restbase.js')
var checkCache = require('../cache.js')

var identity = (x) => x

// Creates a request handler function that will return parsoid html either from
// the cache or the restbase service applying the specified `transform`.
//
// `transform`: Stream -> Stream
module.exports = function (transform) {
  transform = transform || identity
  return function (req, res, match) {
    var title = match.params.title

    checkCache(match.route, title, function (err, cachePath) {
      // Cache miss
      if (err) {
        getRestbaseHtml(title)
          .then((restRes) => {
            var transformed = transform(restRes)
            transformed.pipe(res)
            transformed.pipe(fs.createWriteStream(cachePath))
          })
          .catch((e) => {
            res.statusCode = 500
            res.end(e.message)
          })
      } else {
        fs.createReadStream(cachePath).pipe(res)
      }
    })
  }
}
