'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = require('../Mailer/main.js');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');


function postReset(request, response) {
  var _this = this;

  var email = request.email;
  var mailer = new _main2.default(this.config.transport, this.config.sender, this.config.hostname);
  var resetCode = void 0;

  return this.validateEmail(email).then(function (email) {
    var timestamp = Date.valueOf();
    var randomBytes = crypto.randomBytes(16).toString('hex');
    var hash = crypto.createHash('sha256');
    hash.update(timestamp + '/' + randomBytes);
    resetCode = hash.digest('hex');

    return _this.storeResetCode(resetCode, email);
  }).then(function () {
    return mailer.sendReset(email, resetCode);
  }).then(function () {
    response.sendStatus(200);
  }).catch(function (error) {
    response.sendStatus(error);
  });
}

exports.default = postReset;