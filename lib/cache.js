var sanitize = require('sanitize-filename')
var mkdirp = require('mkdirp')
var fs = require('fs')

var cacheDir = './cache'

function cacheFolder (url) { return `${cacheDir}/${sanitize(url)}` }
function cacheUrl (url, title) { return `${cacheDir}/${sanitize(url)}/${sanitize(title)}.html` }

module.exports = function checkCache (route, title, next) {
  var cache = cacheUrl(route, title)
  mkdirp(cacheFolder(route), function (e) {
    if (e) throw e
    fs.stat(cache, function (err, stats) { next(err, cache) })
  })
}
