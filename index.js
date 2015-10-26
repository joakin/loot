var http = require('http')
var url = require('url')
var mkdirp = require('mkdirp')

var router = require('./lib/routes')

mkdirp('./cache', function (err) {
  // Ensure that the cache directory exists.
  if (err) throw err
  http.createServer((req, res) => {
    // Route request to corresponding endpoint
    var path = url.parse(req.url).pathname
    var match = router.match(path)
    if (match) match.fn(req, res, match)
    else { res.statusCode = 404; res.end('nope') }
  }).listen(process.env.PORT || 7001)
})
