var mkdirp = require('mkdirp')
var fs = require('fs')

/**
 * Creates a filesystem-based cache that is bound to a directory.
 *
 * The cache is represented by a single function, which accepts a key and a callback. The signature
 * of the callback is as follows:
 *
 *     function callback(isCacheHit, reader, writer) {}
 *
 * If the key exists in the cache, then `isCacheHit` will be `true` and `reader` will be a readable
 * stream containing the cached value. Otherwise `isCacheHit` will be `false`, `reader` will be
 * `undefined`, and `writer` will be a writable stream, to which the value should be piped, e.g.:
 *
 * ```
 * var cache = createCache('./foo/bar')
 *
 * function createStream() {
 *   // Create the best stream you've ever created.
 * }
 *
 * cache('123456789', (isCacheHit, reader, writer) => {
 *   var data = isCacheHit
 *     ? reader
 *     : createStream().pipe(writer)
 *
 *   data.pipe(process.stdout)
 * })
 * ```
 */
function createCache (dir) {
  return function cache (key, next) {
    var path = `${dir}/${key}`

    fs.stat(path, function (err) {
      var isCacheHit = !err
      var reader = isCacheHit
        ? fs.createReadStream(path)
        : undefined

      var writer = !isCacheHit
        ? fs.createWriteStream(path)
        : undefined

      next(isCacheHit, reader, writer)
    })
  }
}

module.exports = function (dir, next) {
  mkdirp(dir, function (err) {
    next(err, createCache(dir))
  })
}
