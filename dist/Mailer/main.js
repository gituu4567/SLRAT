'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nodemailer = require('nodemailer');

var Mailer = function () {
  function Mailer(smtps, sender, hostname) {
    _classCallCheck(this, Mailer);

    this.transport = nodemailer.createTransport(smtps);
    this.sender = sender;
    this.hostname = hostname;
  }

  _createClass(Mailer, [{
    key: 'sendActivation',
    value: function sendActivation(address, code) {
      var _this = this;

      var mailOptions = {
        from: this.sender,
        to: address,
        subject: 'Account Activation',
        text: 'please visit this address ' + this.hostname + '/activate?code=' + code,
        html: '<b>please visit this address <a href=' + this.hostname + '/activate?code=' + code + '>' + this.hostname + '/activate?code=' + code + '</a></b>'
      };
      return new Promise(function (resolve, reject) {
        _this.transport.sendMail(mailOptions, function (error, info) {
          if (error) reject(error);
          resolve(info);
        });
      });
    }
  }, {
    key: 'sendReset',
    value: function sendReset(address, code) {
      var _this2 = this;

      var mailOptions = {
        from: this.sender,
        to: address,
        subject: 'Password Reset',
        text: 'please visit this address http://' + this.hostname + '/newpassword?code=' + code,
        html: '<b>please visit this address <a href=' + this.hostname + '/newpassword?code=' + code + '>http://' + this.hostname + '/newpassword?code=' + code + '</a></b>'
      };

      return new Promise(function (resolve, reject) {
        _this2.transport.sendMail(mailOptions, function (error, info) {
          if (error) reject(error);
          resolve(info);
        });
      });
    }
  }]);

  return Mailer;
}();

exports.default = Mailer;