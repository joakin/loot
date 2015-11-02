var router = new (require('routes'))

router.addRoute('/raw/:title', require('./raw'))
router.addRoute('/slim/:title', require('./slim'))

module.exports = router
