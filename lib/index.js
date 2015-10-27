'use strict';

var util = require('util');
var qs = require('querystring');

var _ = require('underscore');
var RestAdapter = require('rendr/server/data_adapter/rest_adapter');

var internals = {};

internals.isNotParsed = function (dic) {
    return (
        dic.hasOwnProperty('get') && _.isFunction(dic.get) &&
        dic.hasOwnProperty('set') && _.isFunction(dic.set)
    );
};

internals.stringify = function (jar) {
    // The white space in the separator is deliberate
    return qs.stringify(jar, '; ', '=');
};

internals.pick = function (dic, keys) {
    var jar = {};

    for (var i = 0, len = keys.length; i < len; i++) {
        jar[keys[i]] = dic.get(keys[i]);
    }

    return jar;
};


internals.appendCookies = function (cookies, api, req) {
    api.headers['Cookie'] = internals.getCookies(cookies, req);
};

internals.getCookies = function (cookies, req) {
    var jar = {};

    if (_.isObject(req.cookies)) {

        if (internals.isNotParsed(req.cookies)) {
            jar = internals.pick(req.cookies, cookies);
        } else {
            jar = _.pick(req.cookies, cookies);
        }

        return internals.stringify(jar);
    }

    return req.cookies;
};

internals.appendHeaders = function (headers, api, req) {
    _.each(headers, function (header) {

        var name;
        var value;


        if (_.isObject(header)) {
            value = req.headers[header.name];
            name = header.as;
        } else {
            value = req.headers[header];
            name = header;
        }

        if (value && name) {
            api.headers[name] = value;
        }

    });
};

function ProxyAdapter(options) {
    RestAdapter.call(this, options);
}

util.inherits(ProxyAdapter, RestAdapter);

ProxyAdapter.prototype.apiDefaults = function (api, req) {
    api = RestAdapter.prototype.apiDefaults.call(this, api, req);

    var apiHost = this.options[api.api] || this.options['default'] || this.options;
    var headers = apiHost.headers;
    var cookies = apiHost.cookies;

    if (headers && headers.length && req && req.headers) {
        internals.appendHeaders(headers, api, req);
    }

    if (cookies && cookies.length && req && req.cookies) {
        internals.appendCookies(cookies, api, req);
    }

    return api;
};

exports = module.exports = ProxyAdapter;
