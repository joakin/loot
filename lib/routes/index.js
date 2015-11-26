var router = new (require('routes'))

router.addRoute('/slim/:title', require('./slim'))
router.addRoute('/slim/lead/:title', require('./slim-lead'))
router.addRoute('/search/:q', require('./search'))

module.exports = router
