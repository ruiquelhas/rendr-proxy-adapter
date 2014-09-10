var Lab = require('lab');
var lab = exports.lab = Lab.script();

var ProxyAdapter = require('../');

var rendr = require('rendr');

var internals = {};
internals.createServer = function () {
  return rendr.createServer({
    dataAdapter: new ProxyAdapter({
      default: {
        protocol: 'http',
        host: '127.0.0.1:1337'
      }
    })
  });
};

lab.experiment('Rendr proxy adapter', function () {
  lab.test('proxies valid cookie data if the request cookies are parsed', function (done) {
    // var server = internals.createServer();
    done();
  });

  lab.test('proxies valid cookie data if the request cookies are not parsed', function (done) {
    // var server = internals.createServer();
    done();
  });
});
