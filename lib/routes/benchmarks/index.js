var restbaseHandler = require('../restbase-req-handler')
var toString = (doc) => doc.toString()

var genericHandler = require('../generic-req-handler')
var wikipediaHandler = genericHandler(require('../../net/wikipedia'))
var mobileviewHandler = genericHandler(require('../../net/mobileview'))

module.exports = (router) => {
  router.addRoute('/benchmarks/restbase/:title', restbaseHandler(toString))
  router.addRoute('/benchmarks/wikipedia/:title', wikipediaHandler)
  router.addRoute('/benchmarks/mobileview/:title', mobileviewHandler)
}
