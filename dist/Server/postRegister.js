"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function postRegister(request, response) {
  var credential = request.body;
  this.createUser(credential).then(function () {
    response.redirect(200);
  }).catch(function (error) {
    return response(error.message);
  });
}

exports.default = postRegister;