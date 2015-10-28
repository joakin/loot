var Benchmark = require('Benchmark')
var fs = require('fs')
var slimTrumpet = require('../lib/transforms/slim')
var slimLibxml = require('../lib/transforms/libxml/slim')

var suiteOptions = {
  defer: true,
  maxTime: 60
}

var suite = new Benchmark.Suite

suite.add('trumpet', (deferred) => {
  var html = fs.createReadStream(__dirname + '/Barack_Obama.html')

  slimTrumpet(html).on('end', () => {
    deferred.resolve()
  })
}, suiteOptions)

suite.add('libxml', (deferred) => {
  fs.readFile(__dirname + '/Barack_Obama.html', (err, html) => {
    slimLibxml(html).toString()

    deferred.resolve()
  })
}, suiteOptions)


suite.on('cycle', (event) => console.log(String(event.target)))

suite.run()
