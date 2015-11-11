var router = new (require('routes'))

router.addRoute('/slim/:title', require('./slim'))
router.addRoute('/slim/lead/:title', require('./slim-lead'))

module.exports = router
