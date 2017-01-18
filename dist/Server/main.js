'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _main = require('../Database/main.js');

var _main2 = _interopRequireDefault(_main);

var _getRoot = require('./getRoot.js');

var _getRoot2 = _interopRequireDefault(_getRoot);

var _postLogin = require('./postLogin.js');

var _postLogin2 = _interopRequireDefault(_postLogin);

var _postRegister = require('./postRegister.js');

var _postRegister2 = _interopRequireDefault(_postRegister);

var _getAuthorization = require('./getAuthorization.js');

var _getAuthorization2 = _interopRequireDefault(_getAuthorization);

var _postToken = require('./postToken.js');

var _postToken2 = _interopRequireDefault(_postToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var express = require('express');
// const path = require('path')
var session = require('express-session');
var formParser = require('body-parser').urlencoded({ extended: false });

var Server = function (_Database) {
  _inherits(Server, _Database);

  function Server(config) {
    _classCallCheck(this, Server);

    var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this, config.database));

    _this.config = config.server;
    _this.endPoint = express();
    _this.server = require('http').createServer(_this.endPoint);
    return _this;
  }

  _createClass(Server, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.server.listen(_this2.config.port, function () {
          console.log('server listening on port ' + _this2.config.port);
          resolve(true);
        });
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.server.close(function () {
          resolve(true);
        });
      });
    }
  }, {
    key: 'listenOnEndPoint',
    value: function listenOnEndPoint() {
      var _this4 = this;

      this.endPoint.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
      });
      this.endPoint.use(session(this.config.session));
      return this.createTables().then(function () {
        _this4.endPoint.get('/', _getRoot2.default.bind(_this4));
        _this4.endPoint.post('/login', formParser, _postLogin2.default.bind(_this4));
        _this4.endPoint.post('/register', formParser, _postRegister2.default.bind(_this4));
        _this4.endPoint.get('/authorization', _getAuthorization2.default.bind(_this4));
        _this4.endPoint.post('/token', _postToken2.default.bind(_this4));
      });
    }
  }]);

  return Server;
}(_main2.default);

exports.default = Server;