var router = new (require('routes'))

router.addRoute('/raw/html/:title', require('./raw.js'))
router.addRoute('/slim/html/:title', require('./slim.js'))

module.exports = router
