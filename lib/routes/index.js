var router = new (require('routes'))

router.addRoute('/api/raw/html/:title', require('./raw.js'))
router.addRoute('/api/slim/html/:title', require('./slim.js'))

module.exports = router
