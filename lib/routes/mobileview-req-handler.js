var getMobileViewHtml = require('../net/mobileview')
var cacheKey = require('./common').cacheKey

module.exports = function (req, res, match, cache) {
  var title = match.params.title

  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  cache(cacheKey(match), function (exists, reader, writer) {
    if (exists) {
      reader.pipe(res)

      return
    }

    getMobileViewHtml(title)
      .then((html) => {
        res.end(html)
        writer.end(html)
      })
  })
}
