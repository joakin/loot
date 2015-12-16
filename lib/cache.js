var mkdirp = require('mkdirp')
var fs = require('fs')

module.exports = function createCache (dir, next) {
  mkdirp(dir, function (err) {
    var cache = function cache (key, next) {
      var path = `${dir}/${key}`

      fs.stat(path, function (err) {
        var reader = err
          ? undefined
          : fs.createReadStream(path)

        var writer = err
          ? fs.createWriteStream(path)
          : undefined

        next(!err, reader, writer)
      })
    }

    next(err, cache)
  })
}
