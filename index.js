var http = require('http')
var url = require('url')

var createCache = require('./lib/cache')

var router = require('./lib/routes')

var port = process.env.PORT || 7001

createCache('./cache', function (err, cache) {
  // Ensure that we have a cache
  if (err) throw err

  http.createServer((req, res) => {
    // Route request to corresponding endpoint
    var path = url.parse(req.url).pathname
    var match = router.match(path)
    if (match) match.fn(req, res, match, cache)
    else { res.statusCode = 404; res.end('nope') }
  }).listen(port, () => console.log('Listening at', port))
})
