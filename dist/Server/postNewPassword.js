"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function postNewPassword(request, response) {
  var _this = this;

  var resetCode = request.query.code;
  if (!resetCode) return response.sendStatus(401);
  this.verifyResetCode(resetCode).then(function (email) {
    return _this.changePassword(email, request.query.password);
  }).then(function () {
    response.sendStatus(200);
  }).catch(function (error) {
    console.log(error);
  });
}

exports.default = postNewPassword;