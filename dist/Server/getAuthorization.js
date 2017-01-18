'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var base32 = require('base32');

function getAuthorization(request, response) {
  if (!request.session.user) return response.redirect(302, '/login' + request._parsedUrl.search);
  if (request.session.user) {
    var timestamp = new Date().valueOf();
    var username = request.session.user;
    var clientId = request.query.client_id;
    var authCode = base32.sha1(timestamp + '&' + username + '/' + clientId);
    this.storeAuthCode(authCode);
    return response.redirect(302, request.query.redirect_uri + '?code=' + authCode);
  }
}

exports.default = getAuthorization;