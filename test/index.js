'use strict';

var Lab = require('lab');
var Code = require('code');

var lab = exports.lab = Lab.script();

var ProxyAdapter = require('../');

lab.experiment('Rendr proxy adapter', function () {
    //jshint sub: true

    lab.test('keeps no request cookies', function (done) {

        var adapter = new ProxyAdapter();

        var api = {
            method: null
        }; // avoid the method being reset by rendr
        var req = {
            cookies: {
                fst: 'value1',
                snd: 'value2'
            }
        };

        var output = adapter.apiDefaults(api, req);

        Code.expect(output.headers).to.not.include('Cookie');

        return done();
    });

    lab.test('keeps all request cookies with cookie-parser', function (done) {

        var adapter = new ProxyAdapter({
            default: {
                host: 'example.com',
                cookies: ['fst', 'snd']
            }
        });

        var api = {
            method: null
        }; // avoid the method being reset by rendr
        var req = {
            cookies: {
                fst: 'value1',
                snd: 'value2'
            }
        };

        var output = adapter.apiDefaults(api, req);

        Code.expect(output.headers).to.include('Cookie');
        Code.expect(output.headers['Cookie']).to.equal('fst=value1; snd=value2');

        return done();
    });

    lab.test('keeps a subset of request cookies with cookie-parser', function (done) {

        var adapter = new ProxyAdapter({
            default: {
                cookies: ['fst']
            }
        });

        var api = {
            method: null
        }; // avoid the method being reset by rendr
        var req = {
            cookies: {
                fst: 'value1',
                snd: 'value2'
            }
        };

        var output = adapter.apiDefaults(api, req);

        Code.expect(output.headers).to.include('Cookie');
        Code.expect(output.headers['Cookie']).to.equal('fst=value1');

        return done();
    });

    lab.test('keeps a subset of request cookies with connect-cookies', function (done) {

        var adapter = new ProxyAdapter({
            default: {
                cookies: ['name']
            }
        });

        var api = {
            method: null
        }; // avoid the method being reset by rendr

        var req = {
            cookies: {
                get: function () {
                    return 'value';
                },
                set: function () {}
            }
        };

        var output = adapter.apiDefaults(api, req);

        Code.expect(output.headers).to.include('Cookie');
        Code.expect(output.headers['Cookie']).to.equal('name=value');

        return done();
    });

    lab.test('keeps the raw request cookies if the parser is not known', function (done) {

        var adapter = new ProxyAdapter({
            default: {
                cookies: ['name']
            }
        });
        var api = {
            method: null
        }; // avoid the method being reset by rendr
        var req = {
            cookies: 'name=value'
        };

        var output = adapter.apiDefaults(api, req);

        Code.expect(output.headers).to.include('Cookie');
        Code.expect(output.headers['Cookie']).to.equal('name=value');

        return done();
    });

    lab.test('does nothing when there are no cookies', function (done) {

        var adapter = new ProxyAdapter();
        var api = {
            method: null
        }; // avoid the method being reset by rendr

        var output = adapter.apiDefaults(api);

        Code.expect(output.headers).to.not.include('Cookie');

        return done();
    });

    lab.test('falls back to the default api options', function (done) {

        var adapter = new ProxyAdapter({
            default: {
                host: 'example.com'
            }
        });
        var api = {
            method: null
        }; // avoid the method being reset by rendr
        var output = adapter.apiDefaults(api);

        Code.expect(output.headers).to.be.include('User-Agent');

        return done();
    });

    lab.test('keeps the selected request headers', function (done) {

        var adapter = new ProxyAdapter({
            headers: ['host']
        });

        var api = {
            method: null
        }; // avoid the method being reset by rendr

        var req = {
            headers: {
                'host': 'localhost:1337'
            }
        };

        var output = adapter.apiDefaults(api, req);

        Code.expect(output.headers).to.include('host');
        Code.expect(output.headers).to.not.include('hostname');
        Code.expect(output.headers['host']).to.equal('localhost:1337');

        return done();
    });

    lab.test('keeps the selected request headers', function (done) {

        var adapter = new ProxyAdapter({
            default: {
                headers: ['host']
            }
        });

        var api = {
            method: null
        }; // avoid the method being reset by rendr

        var req = {
            headers: {
                'host': 'localhost:1337'
            }
        };

        var output = adapter.apiDefaults(api, req);

        Code.expect(output.headers).to.include('host');
        Code.expect(output.headers).to.not.include('hostname');
        Code.expect(output.headers['host']).to.equal('localhost:1337');

        return done();
    });
});
