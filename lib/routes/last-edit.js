var querystring = require('querystring')
var https = require('https')
var concat = require('concat-stream')
var handleError = require('./common').handleError

function createOptions (title) {
  return {
    protocol: 'https:',
    host: 'en.wikipedia.org',
    path: '/w/api.php?' + querystring.stringify({
      action: 'query',

      format: 'json',
      formatversion: 2,

      prop: 'revisions',
      titles: title
    })
  }
}

function lasteditinfo (query) {
  return new Promise((resolve, reject) => {
    https.get(createOptions(query), (res) => {
      res.pipe(concat((json) => {
        json = JSON.parse(json)
        json = transformer(json)
        if ( json.missing ) {
          reject(new Error('Non-existent title'))
        } else {
          resolve(JSON.stringify(json))
        }
      }))
    })
    .on('error', (e) => reject(e))
  })
}

function transformer (results) {
  if ( results && results.query && results.query.pages
      && results.query.pages.length && results.query.pages[0].revisions ) {
    return results.query.pages[0].revisions[0]
  } else {
    return {
      missing: true
    }
  }
}

module.exports = function (_, res, match) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  lasteditinfo(match.params.q)
    .then((json) => res.end(json))
    .catch((e) => handleError(res, e))
}
