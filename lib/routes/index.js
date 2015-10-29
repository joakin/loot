var router = new (require('routes'))

router.addRoute('/raw/:title', require('./raw.js'))
router.addRoute('/slim/:title', require('./slim.js'))

module.exports = router
