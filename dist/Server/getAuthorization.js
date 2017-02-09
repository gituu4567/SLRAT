'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var crypto = require('crypto');
var url = require('url');

function getAuthorization(request, response) {
  if (!request.session.user) return response.redirect(302, '/login' + request._parsedUrl.search);
  if (request.session.user) {
    var timestamp = new Date().valueOf();
    var randomBytes = crypto.randomBytes(16).toString('hex');
    var hash = crypto.createHash('sha256');
    hash.update(timestamp + '/' + randomBytes);
    var authCode = hash.digest('hex');
    this.storeAuthCode(authCode, request.session.user);
    var redirection = url.parse(request.query.redirect_uri, true);
    delete redirection.search;
    redirection.query.code = authCode;
    var redirectURI = url.format(redirection);
    return response.redirect(302, url.format(redirectURI));
  }
}

exports.default = getAuthorization;