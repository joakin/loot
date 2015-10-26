module.exports = function (s) {
  s.selectAll('[data-mw]', (el) => el.removeAttribute('data-mw'))
}
