var router = new (require('routes'))
var mountBenchmarks = require('./benchmarks')

router.addRoute('/random', require('./random'))
router.addRoute('/slim/:title', require('./slim'))
router.addRoute('/slim/lead/:title', require('./slim-lead'))
router.addRoute('/search/:q', require('./search'))

mountBenchmarks(router)

module.exports = router
