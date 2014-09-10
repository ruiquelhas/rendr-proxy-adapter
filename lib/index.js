var util = require('util');
var qs = require('querystring');

var _ = require('underscore');
var RestAdapter = require('rendr/server/data_adapter/rest_adapter');

var internals = {};

// Older express versions using express.cookieParser()
internals.isNotDeprecated = function (dic) {
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


function ProxyAdapter(options) {
    this.cookies = options ? (options.cookies ? options.cookies : []) : [];

    RestAdapter.call(this, options);
}

util.inherits(ProxyAdapter, RestAdapter);

ProxyAdapter.prototype.apiDefaults = function (api, req) {
  //jshint sub: true

  api = RestAdapter.prototype.apiDefaults.call(this, api, req);

  if (req && req.cookies) {
    if (_.isObject(req.cookies)) {
      if (this.cookies.length > 0 && internals.isNotDeprecated(req.cookies)) {
        var jar = internals.pick(req.cookies, this.cookies);
        api.headers['Cookie'] = internals.stringify(jar);
      } else {
        api.headers['Cookie'] = internals.stringify(req.cookies);
      }
    } else {
      // The cookies are in their raw format
      api.headers['Cookie'] = req.cookies;
    }
  }

  return api;
};

exports = module.exports = ProxyAdapter;
