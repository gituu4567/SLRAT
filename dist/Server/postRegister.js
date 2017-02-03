'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = require('../Mailer/main.js');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');


function postRegister(request, response) {
  var _this = this;

  var mailer = new _main2.default(this.config.transport, this.config.sender, this.config.hostname);
  var credential = request.body;
  var activationCode = void 0;
  var userLimiter = this.config.userLimiter || [/.{1,}/];
  var allowed = userLimiter.some(function (re) {
    return re.test(credential.email);
  });
  if (!allowed) return response.sendStatus(403);
  this.createUser(credential).then(function () {
    var timestamp = Date.valueOf();
    var randomBytes = crypto.randomBytes(16).toString('hex');
    var hash = crypto.createHash('sha256');
    hash.update(timestamp + '/' + randomBytes);
    activationCode = hash.digest('hex');

    return _this.storeActivationCode(activationCode, credential.email);
  }).then(function () {
    return mailer.sendActivation(credential.email, activationCode);
  }).then(function () {
    response.status(200).send('activation link has been sent to your email');
  }).catch(function (error) {
    response.status(500).send(error.message);
  });
}

exports.default = postRegister;