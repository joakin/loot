var Benchmark = require('Benchmark')
var fs = require('fs')
var slim = require('../lib/transforms/slim')

var suite = new Benchmark.Suite

suite.add('slim', (deferred) => {
  var html = fs.createReadStream(__dirname + '/Barack_Obama.html')

  slim(html).on('end', () => {
    deferred.resolve()
  })
}, { defer: true, maxTime: 60 })

suite.on('cycle', (event) => console.log(String(event.target)))

suite.run()
