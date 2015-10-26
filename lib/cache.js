var sanitize = require('sanitize-filename')
var mkdirp = require('mkdirp')
var fs = require('fs')

var cacheDir = './cache'

function cacheFolder (url) { return `${cacheDir}/${sanitize(url)}` }
function cacheUrl (url, title) { return `${cacheDir}/${sanitize(url)}/${sanitize(title)}.html` }

// Checks for a cached file given a `route` and a `title`.
// Will call callback `next` with:
//   `err`: Error if no cache was found, null if cache exists
//   `cachePath`: The path of the cache file checked
module.exports = function checkCache (route, title, next) {
  var cachePath = cacheUrl(route, title)
  mkdirp(cacheFolder(route), function (e) {
    if (e) throw e
    fs.stat(cachePath, function (err, stats) { next(err, cachePath) })
  })
}
