'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getRoot(request, response) {
  var page = request.session.user || 'no user';
  response.send(page);
}

exports.default = getRoot;