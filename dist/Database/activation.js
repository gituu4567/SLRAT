'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function storeActivationCode(code, email) {
  var query = 'INSERT INTO activationcodes (code, email) VALUES (\'' + code + '\',\'' + email + '\')';

  return this.exec(query).then(function (result) {
    return Promise.resolve(result);
  }).catch(function (error) {
    if (error.message === 'SQLITE_ERROR: no such table: activationcodes') {
      return Promise.reject(new Error('no activationcodes table found'));
    }
  });
}

function verifyActivation(code) {
  var _this = this;

  var query = 'SELECT email FROM activationcodes WHERE code=\'' + code + '\'';

  return new Promise(function (resolve, reject) {
    _this.database.get(query, function (error, row) {
      if (error) reject(error);
      if (!error) {
        if (row === undefined) reject(new Error('activation code not found'));
        if (row) resolve(row.email);
      }
    });
  });
}

exports.storeActivationCode = storeActivationCode;
exports.verifyActivation = verifyActivation;