var fs = require('fs')
var https = require('https')
var mkdirp = require('mkdirp')
var sanitize = require('sanitize-filename')

var restbase = 'https://en.wikipedia.org/api/rest_v1'
function getRestbaseHtml (title) {
  return new Promise((resolve, reject) =>
    https.get(`${restbase}/page/html/${title}`, (res) => resolve(res))
      .on('error', (e) => reject(e)))
}

function cacheFolder (url) { return `./cache/${sanitize(url)}` }
function cacheUrl (url, title) { return `./cache/${sanitize(url)}/${sanitize(title)}.html` }

module.exports = function (transform) {
  return function (req, res, match) {
    var title = match.params.title
    var cache = cacheUrl(match.route, title)

    // Check cache
    mkdirp(cacheFolder(match.route), function (err) {
      if (err) throw err
      fs.stat(cache, function (err, stats) {
        // Cache miss
        if (err) {
          getRestbaseHtml(title)
            .then((restRes) => {
              var transformed = transform ? transform(restRes) : restRes
              transformed.pipe(res)
              transformed.pipe(fs.createWriteStream(cache))
            })
            .catch((e) => {
              res.statusCode = 500
              res.end(e.message)
            })
        } else {
          fs.createReadStream(cache).pipe(res)
        }
      })
    })
  }
}
