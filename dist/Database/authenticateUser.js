'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function createUser(credential) {
  var query = 'INSERT INTO users (email, password) VALUES (\'' + credential.email + '\', \'' + credential.password + '\')';

  return this.exec(query).then(function (result) {
    return Promise.resolve(true);
  }).catch(function (error) {
    if (error.message === 'SQLITE_ERROR: no such table: users') {
      return Promise.reject(new Error('no user table found'));
    }
  });
}

function authenticate(credential) {
  var query = 'SELECT email From users WHERE email=\'' + credential.email + '\' AND password=\'' + credential.password + '\'';

  return this.get(query).then(function (row) {
    if (row === undefined) return Promise.reject(new Error('credential does not match'));
    return Promise.resolve(row.email);
  }).catch(function (error) {
    if (error.message === 'SQLITE_ERROR: no such table: users') return Promise.reject(new Error('no user table found'));
    return Promise.reject(error);
  });
}

exports.createUser = createUser;
exports.authenticate = authenticate;