'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function postLogin(request, response) {
  var credential = request.body;
  this.authenticate(credential).then(function () {
    request.session.user = credential.email;
    var redirectURI = request.query.redirect_uri;
    if (redirectURI) return response.redirect(302, '/authorization?redirect_uri=' + redirectURI);
    // NOTE: maybe unnecessary ???
    return response.redirect(302, '/');
  }).catch(function (error) {
    if (error.message === 'credential does not match') return response.status(401).send('wrong email or password');
    return response.status(500).send(error.message);
  });
}

exports.default = postLogin;