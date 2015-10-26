var removeAll = require('./remove-all.js')

module.exports = function (s) {
  removeAll(s, 'link[rel=stylesheet]')
  removeAll(s, 'style')
}
