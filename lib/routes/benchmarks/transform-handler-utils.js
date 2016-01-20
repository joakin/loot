var baseCacheKey = require('../common').cacheKey

exports.getTransforms = function getTransforms (query, TRANSFORMS) {
  if (!query.transforms) {
    return []
  }

  var validTransforms = Object.keys(TRANSFORMS)
  var transforms = query.transforms.split('|')

  // validTransforms is a fixed length whereas transforms is bounded by the maximum length of a URL
  // that can be sent by a browser.
  return validTransforms.filter(
    (transform) => transforms.indexOf(transform) !== -1
  )
}

exports.createTransform = function createTransform (transforms, TRANSFORMS, defaultTransforms) {
  // i.e. /benchmarks/loot/:title, /benchmarks/loot/:title?transforms= will fall back to the default
  // transform.
  if (transforms.length === 0) {
    transforms = defaultTransforms
  }

  return function (doc) {
    transforms.forEach((transform) => TRANSFORMS[transform](doc))

    return doc
  }
}

exports.cacheKey = function cacheKey (match, transforms) {
  var suffix = transforms.join('|')

  return baseCacheKey(match) + suffix
}
