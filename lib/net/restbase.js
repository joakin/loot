var https = require('https')
var concat = require('concat-stream')

var restbase = 'https://en.wikipedia.org/api/rest_v1'

module.exports = function getRestbaseHtml (title) {
  var title = encodeURIComponent(title);
  return new Promise((resolve, reject) =>
    https.get(`${restbase}/page/html/${title}`, (res) => {
      if (res.statusCode === 200) {
        resolve(res)
      } else {
        res.pipe(concat((contents) => {
          var resp = JSON.parse(contents.toString())
          var err = new Error(resp.title + ' ' + resp.detail)
          err.code = res.statusCode
          reject(err)
        }))
      }
    })
    .on('error', (e) => {
      reject(e)
    })
  )
}
