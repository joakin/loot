var router = new (require('routes'))

router.addRoute('/raw/:title', require('./raw.js'))
router.addRoute('/noimages/:title', require('./no-images.js'))
router.addRoute('/slim/:title', require('./slim.js'))

module.exports = router
