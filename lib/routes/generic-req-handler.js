var common = require('./common')
var cacheKey = common.cacheKey
var handleError = common.handleError

module.exports = function genericReqHandler (getHtmlByTitle) {
  return function (req, res, match, cache) {
    var title = match.params.title

    res.setHeader('Content-Type', 'text/html; charset=utf-8')

    cache(cacheKey(match), function (isCacheHit, entry, write) {
      if (isCacheHit) {
        entry.read().pipe(res)

        return
      }

      getHtmlByTitle(title)
        .then((html) => {
          res.end(html)
          write().end(html)
        })
        .catch((e) => handleError(res, e))
    })
  }
}
