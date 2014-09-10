var Lab = require('lab');
var lab = exports.lab = Lab.script();

var ProxyAdapter = require('../');

lab.experiment('Rendr proxy adapter', function () {
  //jshint sub: true

  lab.test('keeps all request cookies with cookie-parser', function (done) {
    var adapter = new ProxyAdapter();

    var api = { method: null }; // avoid the method being reset by rendr
    var req = { cookies: { fst: 'value1', snd: 'value2' }};

    var output = adapter.apiDefaults(api, req);

    Lab.expect(output.headers).to.have.property('Cookie');
    Lab.expect(output.headers['Cookie']).to.equal('fst=value1; snd=value2');

    done();
  });

  lab.test('keeps a subset of request cookies with cookie-parser', function (done) {
    var adapter = new ProxyAdapter({ cookies: ['fst'] });

    var api = { method: null }; // avoid the method being reset by rendr
    var req = { cookies: { fst: 'value1', snd: 'value2' }};

    var output = adapter.apiDefaults(api, req);

    Lab.expect(output.headers).to.have.property('Cookie');
    Lab.expect(output.headers['Cookie']).to.equal('fst=value1');

    done();
  });

  lab.test('keeps a subset of request cookies with connect-cookies', function (done) {
    var adapter = new ProxyAdapter({ cookies: ['name'] });

    var api = { method: null }; // avoid the method being reset by rendr

    var req = {
      cookies: {
        get: function () {
          return 'value';
        },
        set: function () {}
      }
    };

    var output = adapter.apiDefaults(api, req);

    Lab.expect(output.headers).to.have.property('Cookie');
    Lab.expect(output.headers['Cookie']).to.equal('name=value');

    done();
  });

  lab.test('keeps the raw request cookies if the parser is not known', function (done) {
    var adapter = new ProxyAdapter({});
    var api = { method: null }; // avoid the method being reset by rendr
    var req = { cookies: 'name=value' };

    var output = adapter.apiDefaults(api, req);

    Lab.expect(output.headers).to.have.property('Cookie');
    Lab.expect(output.headers['Cookie']).to.equal('name=value');

    done();
  });

  lab.test('does nothing when there are no cookies', function (done) {
    var adapter = new ProxyAdapter({});
    var api = { method: null }; // avoid the method being reset by rendr

    var output = adapter.apiDefaults(api);

    Lab.expect(output.headers).to.not.have.property('Cookie');

    done();
  });
});
