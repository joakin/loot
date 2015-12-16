var handler = require('../restbase-req-handler')
var identity = (doc) => doc.toString()

module.exports = (router) => {
  router.addRoute('/benchmarks/restbase/:title', handler(identity))
}
