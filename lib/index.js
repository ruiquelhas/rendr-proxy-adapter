var util = require('util');
var qs = require('querystring');

var _ = require('underscore');
var RestAdapter = require('rendr/server/data_adapter/rest_adapter');

function ProxyAdapter(options) {
    RestAdapter.call(this, options);
}

util.inherits(ProxyAdapter, RestAdapter);

ProxyAdapter.prototype.apiDefaults = function (api, req) {
  //jshint sub: true

  api = RestAdapter.prototype.apiDefaults.call(this, api, req);

  if (req && req.cookies) {
    if (_.isObject(req.cookies)) {
      // The cookies were parsed using connect's cookieParser
      // The white space in the separator is deliberate
      api.headers['Cookie'] = qs.stringify(req.cookies, '; ', '=');
    } else {
      // The cookies are in their raw format
      api.headers['Cookie'] = req.cookies;
    }
  }

  return api;
};

exports = module.exports = ProxyAdapter;
