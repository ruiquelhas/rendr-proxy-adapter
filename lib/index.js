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

internals.appendCookies = function (api, req) {
    //jshint sub: true
    var jar = {};

    if (_.isObject(req.cookies)) {
        if (this.cookies.length > 0 && internals.isNotParsed(req.cookies)) {
            jar = internals.pick(req.cookies, this.cookies);
        } else if (this.cookies.length > 0) {
            jar = _.pick(req.cookies, this.cookies);
        } else {
            jar = req.cookies;
        }

        api.headers['Cookie'] = internals.stringify(jar);
    } else {
        // Raw cookies
        api.headers['Cookie'] = req.cookies;
    }

    return api;
};

internals.appendHeaders = function (api, req) {
    _.each(this.headers, function (header) {
        var value = req.headers[header];

        if (value) {
            api.headers[header] = value;
        }
    });

    return api;
};


function ProxyAdapter(options) {
    options = (options || {})

    this.cookies = options.cookies ? options.cookies : [];
    this.headers = options.headers ? options.headers : [];

    RestAdapter.call(this, options);
}

util.inherits(ProxyAdapter, RestAdapter);

ProxyAdapter.prototype.apiDefaults = function (api, req) {
    api || (api = { method: null });

    api = RestAdapter.prototype.apiDefaults.call(this, api, req);

    if (req && req.cookies) {
        api = internals.appendCookies.call(this, api, req);
    }

    if (req && req.headers) {
        api = internals.appendHeaders.call(this, api, req);
    }

    return api;
};

exports = module.exports = ProxyAdapter;
