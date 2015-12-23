var crypto = require('crypto')

exports.cacheKey = function (match) {
  var hash = crypto.createHash('sha256')

  hash.update(match.route)
  hash.update(match.params.title)

  return hash.digest('hex')
}

exports.handleError = (res, e) => {
  res.statusCode = e.code || 500
  res.end(JSON.stringify({
    error: {
      message: e.message
    }
  }))
}
