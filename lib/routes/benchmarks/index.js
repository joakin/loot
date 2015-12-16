var restbaseHandler = require('../restbase-req-handler')
var identity = (doc) => doc.toString()
var wikipediaHandler = require('../wikipedia-req-handler')

module.exports = (router) => {
  router.addRoute('/benchmarks/restbase/:title', restbaseHandler(identity))
  router.addRoute('/benchmarks/wikipedia/:title', wikipediaHandler)
}
