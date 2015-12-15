var https = require('https')

var restbase = 'https://en.wikipedia.org/api/rest_v1'

module.exports = function getRestbaseHtml (title) {
  return new Promise((resolve, reject) =>
    https.get(`${restbase}/page/html/${title}`, (res) => {
      if (res.statusCode === 200) {
        resolve(res)
      } else {
        var err = new Error('Page not found')
        err.code = 404
        reject( err );
      }
    } )
    .on('error', (e) => {
      reject(e);
    } )
  )
}
