'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function postNewPassword(request, response) {
  var _this = this;

  var resetCode = request.query.code;
  if (!resetCode) return response.sendStatus(401);
  this.verifyResetCode(resetCode).then(function (email) {
    return _this.changePassword(email, request.body.password);
  }).then(function () {
    response.status(200).send('your password has been changed');
  }).catch(function (error) {
    response.status(500).send(error.message);
  });
}

exports.default = postNewPassword;