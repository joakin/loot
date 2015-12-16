var https = require('https')
var concat = require('concat-stream')

var wikipedia = 'https://en.wikipedia.org/w/api.php'

module.exports = function getWikipediaHtml (title) {
  var encodedTitle = encodeURIComponent(title)

  return new Promise((resolve) =>
    https.get(`${wikipedia}?format=json&action=parse&page=${encodedTitle}`, (res) => {
      res.pipe(concat((contents) => {
        var data = JSON.parse(contents.toString())
        resolve(data.parse.text['*'])
      }))
    })
  )
}
