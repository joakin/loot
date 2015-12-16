var https = require('https')
var concat = require('concat-stream')

var wikipedia = 'https://en.wikipedia.org/w/api.php'

module.exports = function getWikipediaHtml (title) {
  var encodedTitle = encodeURIComponent(title)

  return new Promise((resolve) =>
    https.get(`${wikipedia}?format=json&action=mobileview&page=${encodedTitle}&sections=all&prop=text`, (res) => {
      res.pipe(concat((contents) => {
        var data = JSON.parse(contents.toString())
        var html = data.mobileview.sections.reduce(
          (acc, section) => acc + section.text,
          ''
        )

        resolve(html)
      }))
    })
  )
}
