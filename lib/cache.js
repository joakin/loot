var mkdirp = require('mkdirp')
var fs = require('fs')
var db = require('./db')

/**
 * Creates a filesystem-based cache that is bound to a directory.
 *
 * The cache is represented by a single function, which accepts a key and
 * a callback. The signature of the callback is as follows:
 *
 *     function callback(isCacheHit, entry, write) {}
 *
 * If the key exists in the cache, then `isCacheHit` will be `true` and `entry`
 * will be an object containing a `read` function that will give you a readable
 * stream containing the cached value and a `meta` property with the cache
 * metadata. Otherwise `isCacheHit` will be `false`, `entry` will be
 * `undefined`, and `write` will be a function that takes metadata, and
 * returns a writable stream, to which the value should be piped, e.g.:
 *
 * ```
 * var cache = createCache('./foo/bar')
 *
 * function createStream() {
 *   // Create the best stream you've ever created.
 * }
 *
 * cache('123456789', (isCacheHit, entry, write) => {
 *   var data = isCacheHit
 *     ? entry.read()
 *     : createStream().pipe(write({ metadata: 'whatever' }))
 *
 *   data.pipe(process.stdout)
 * })
 * ```
 */
function createCache (dir) {
  return function cache (key, next) {
    var path = `${dir}/${key}`

    db.get(key, (err, metadata) => {
      if (err) afterCacheCheck(false)
      else fs.stat(path, (err) => { afterCacheCheck(!err, metadata) })
    })

    function afterCacheCheck (isCacheHit, meta) {
      var entry = isCacheHit
        ? { meta, read: () => fs.createReadStream(path) }
        : undefined

      var write = !isCacheHit
        ? (meta) => { db.put(key, meta || {}); return fs.createWriteStream(path) }
        : undefined

      next(isCacheHit, entry, write)
    }
  }
}

module.exports = function (dir, next) {
  mkdirp(dir, function (err) {
    next(err, createCache(dir))
  })
}
