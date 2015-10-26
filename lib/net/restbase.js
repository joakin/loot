var https = require('https')

var restbase = 'https://en.wikipedia.org/api/rest_v1'

module.exports = function getRestbaseHtml (title) {
  return new Promise((resolve, reject) =>
    https.get(`${restbase}/page/html/${title}`, (res) => resolve(res))
      .on('error', (e) => reject(e)))
}
