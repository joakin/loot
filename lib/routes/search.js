var LIMIT = 15

var querystring = require('querystring')
var https = require('https')
var concat = require('concat-stream')
var handleError = require('./common').handleError

function createOptions (query, limit) {
  return {
    protocol: 'https:',
    host: 'en.wikipedia.org',
    path: '/w/api.php?' + querystring.stringify({
      action: 'query',

      format: 'json',
      formatversion: 2,

      prop: 'pageprops',
      ppprop: 'displaytitle',

      redirects: '', // Resolve redirects.

      generator: 'prefixsearch',
      gpsnamespace: 0,
      gpssearch: query,
      gpslimit: limit
    })
  }
}

function search (query) {
  return new Promise((resolve, reject) => {
    https.get(createOptions(query, LIMIT), (res) => {
      res.pipe(concat((json) =>
        resolve(transformJson(json, transformer))
      ))
    })
    .on('error', (e) => reject(e))
  })
}

// Transforms a JSON string by parsing it, transforming the object, and stringifying the transformed
// object.
function transformJson (json, fn) {
  return JSON.stringify(
    fn(
      JSON.parse(json)
    )
  )
}

function transformer (results) {
  var redirects = {}
  var result = {
    pages: []
  }

  if (!results.query) {
    return result
  }

  if (results.query.redirects) {
    // Generate a map of result index to the title (String) of the page the redirect is from.
    results.query.redirects.forEach((redirect) => {
      redirects[redirect.index] = redirect.from
    })
  }

  if (results.query.pages) {
    result.pages = new Array(results.query.pages.length)

    results.query.pages.forEach((page) => {
      var newPage = {}

      result.pages[page.index - 1] = newPage

      // Has a redirect been followed?
      if (redirects[page.index]) {
        newPage.redirected_from = redirects[page.index]
      }

      newPage.title = page.title

      if (page.pageprops) {
        newPage.title_html = page.pageprops.displaytitle
      }
    })
  }

  return result
}

module.exports = function (_, res, match) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  search(match.params.q)
    .then((json) => res.end(json))
    .catch((e) => handleError(res, e))
}
