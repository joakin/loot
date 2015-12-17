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

      list: 'random',

      rnnamespace: 0
    })
  }
}

function random (query) {
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
  var result = {
    title: null
  }

  if (!results.query) {
    return result
  }

  if (results.query.random) {
    result.title = results.query.random[0].title
  }

  return result
}

module.exports = function (_, res, match) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  random(match.params.q)
    .then((json) => res.end(json))
    .catch((e) => handleError(res, e))
}
