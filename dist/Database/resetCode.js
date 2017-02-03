'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function storeResetCode(code, email) {
  var query = 'INSERT INTO resetcodes (code, email) VALUES (\'' + code + '\',\'' + email + '\')';

  return this.exec(query).then(function (result) {
    return Promise.resolve(result);
  }).catch(function (error) {
    if (error.message === 'SQLITE_ERROR: no such table: activationcodes') {
      return Promise.reject(new Error('no resetcodes table found'));
    }
  });
}

function verifyResetCode(code) {
  var query = 'SELECT email FROM resetcodes WHERE code=\'' + code + '\'';

  return this.get(query).then(function (row) {
    if (row === undefined) return Promise.reject(new Error('reset code not found'));
    return Promise.resolve(row.email);
  }).catch(function (error) {
    return Promise.reject(error);
  });
}

function changePassword(email, password) {
  var query = 'UPDATE users SET password=\'' + password + '\' WHERE email=\'' + email + '\'';

  return this.exec(query).then(function (result) {
    return Promise.resolve(result);
  }).catch(function (error) {
    return Promise.reject(new Error(error));
  });
}

exports.storeResetCode = storeResetCode;
exports.verifyResetCode = verifyResetCode;
exports.changePassword = changePassword;