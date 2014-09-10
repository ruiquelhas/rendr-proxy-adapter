# rendr-proxy-adapter

Rendr RestAdapter for proxied APIs.

## Raison d'etre

For some reason, [rendr](//github.com/rendrjs/rendr) thinks that, by default, request cookies should be ignored when the browser hits the server via the `RestAdapter`.

## What this is

A custom version of the traditional `RestAdapter` that inherits all its functionality and also adds support for keeping the cookie context, which is useful, for instance, when there is a proxy between the client and the API.

## What this is not

A cookie store. So, any security (encryption, decryption, yada yada) or management layer should be provided via the middleware you are using or the endpoint you plan to hit.

## How to use

If you are using [cookie-parser](//github.com/expressjs/cookie-parser), this ensures all cookies are proxied.

```javascript
var ProxyAdapter = require('rendr-proxy-adapter')
var adapter = new ProxyAdapter();

rendr.createServer({
  dataAdapter: adapter
  // whatevs
});
```

You can select which cookies to proxy by providing a list of cookie names. If you're a hipster, and you're using [connect-cookies](//github.com/expressjs/cookies) you are **required** to do that.

```javascript
var ProxyAdapter = require('rendr-proxy-adapter')
var adapter = new ProxyAdapter({
  cookies: [
    'name',
    // whatevs
  ]
});

rendr.createServer({
  dataAdapter: adapter
  // whatevs
});
```

## Contributions

Issues and pull requests are welcome.
