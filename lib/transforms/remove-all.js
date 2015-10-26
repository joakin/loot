module.exports = function (stream, selector) {
  stream.selectAll(
    selector,
    (el) => el.createWriteStream({ outer: true }).end('')
  )
}
