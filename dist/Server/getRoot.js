"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getRoot(request, response) {
  var user = request.session.user;
  if (user) return response.status(200).send("you are logged in as " + user);
  return response.status(200).send("you are not logged in");
}

exports.default = getRoot;