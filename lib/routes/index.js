var router = new (require('routes'))

router.addRoute('/raw/:title', require('./raw'))
router.addRoute('/slim/:title', require('./slim'))
router.addRoute('/slim/lead/:title', require('./slim-lead'))

module.exports = router
