'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var jwt = require('jsonwebtoken');

function postToken(request, response) {
  var _this = this;

  var authCode = request.query.code;
  this.verifyAuthCode(authCode).then(function () {
    // TODO: should resolve a secret
    var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 60 * 60 }, _this.config.token.secret);
    response.send(token);
  }).catch(function (error) {
    if (error.message === 'authorization code not found') return response.sendStatus(401);
    return response.status(500).send(error.message);
  });
}

exports.default = postToken;