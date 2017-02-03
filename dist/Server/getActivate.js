'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getActivate(request, response) {
  var _this = this;

  var activationCode = request.query.code;
  if (!activationCode) return response.sendStatus(401);
  this.verifyActivation(activationCode).then(function (email) {
    return _this.activateUser(email);
  }).then(function () {
    response.status(200).send('you are activated');
  });
}

exports.default = getActivate;