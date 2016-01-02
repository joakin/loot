var https = require('https')
var concat = require('concat-stream')

var restbaseHost = 'en.wikipedia.org'
var restbasePath = '/api/rest_v1'

module.exports = function getRestbaseHtml (title, options) {
  var encodedTitle = encodeURIComponent(title)
  return new Promise((resolve, reject) => {
    var opts = Object.assign({
      host: restbaseHost,
      path: `${restbasePath}/page/html/${encodedTitle}`
    }, options || {})
    https.get(opts, (res) => {
      if (res.statusCode >= 400) {
        res.pipe(concat((contents) => {
          var resp = JSON.parse(contents.toString())
          var err = new Error(resp.title + ' ' + resp.detail)
          err.code = res.statusCode
          reject(err)
        }))
      } else {
        resolve(res)
      }
    })
    .on('error', (e) => {
      reject(e)
    })
  })
}
