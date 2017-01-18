'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validateUser = require('./validateUser.js');

var _authenticateUser = require('./authenticateUser.js');

var _authCode = require('./authCode.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sqlite3 = require('sqlite3').verbose();

var database = function () {
  function database(config) {
    _classCallCheck(this, database);

    this.database = new sqlite3.Database(config.filename);
  }

  // mostly for testing


  _createClass(database, [{
    key: 'exec',
    value: function exec(query) {
      return new Promise(function (resolve, reject) {
        this.database.exec(query, function (err) {
          if (!err) resolve(true);
          if (err) reject(err);
        });
      }.bind(this));
    }
  }, {
    key: 'get',
    value: function get(query) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.database.get(query, function (error, row) {
          if (!error) resolve(row);
          if (error) reject(error);
        });
      });
    }
  }, {
    key: 'close',
    value: function close(cb) {
      this.database.close(cb);
    }
  }, {
    key: 'createTables',
    value: function createTables() {
      var query = '\n      CREATE TABLE validusers(email TEXT PRIMARY KEY NOT NULL);\n      CREATE TABLE users(email TEXT PRIMARY KEY NOT NULL, password TEXT NOT NULL);\n      CREATE TABLE authcodes(code TEXT PRIMARY KEY NOT NULL);\n    ';
      return this.exec(query);
    }
  }, {
    key: 'instance',
    get: function get() {
      return this.database;
    }
  }]);

  return database;
}();

database.prototype.addValidUser = _validateUser.addValidUser;
database.prototype.allowThisUser = _validateUser.allowThisUser;
database.prototype.createUser = _authenticateUser.createUser;
database.prototype.authenticate = _authenticateUser.authenticate;
database.prototype.storeAuthCode = _authCode.storeAuthCode;
database.prototype.verifyAuthCode = _authCode.verifyAuthCode;

exports.default = database;