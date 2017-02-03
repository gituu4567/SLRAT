'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function createUser(credential) {
  var query = 'INSERT INTO users (email, password, active) VALUES (\'' + credential.email + '\', \'' + credential.password + '\', 0)';

  return this.exec(query).then(function (result) {
    return Promise.resolve(true);
  }).catch(function (error) {
    if (error.message === 'SQLITE_ERROR: no such table: users') {
      return Promise.reject(new Error('no user table found'));
    }
  });
}

function authenticate(credential) {
  var query = 'SELECT email, active From users WHERE email=\'' + credential.email + '\' AND password=\'' + credential.password + '\'';
  return this.get(query).then(function (row) {
    if (row === undefined) return Promise.reject(new Error('credential does not match'));
    if (!row.active) return Promise.reject(new Error('user is not active'));
    return Promise.resolve(row.email);
  }).catch(function (error) {
    if (error.message === 'SQLITE_ERROR: no such table: users') return Promise.reject(new Error('no user table found'));
    return Promise.reject(error);
  });
}

function activateUser(user) {
  var query = 'UPDATE users SET active=1 WHERE email=\'' + user + '\'';

  return this.exec(query);
}

function validateEmail(email) {
  var query = 'SELECT email FROM users WHERE email=\'' + email + '\'';

  return this.get(query).then(function (row) {
    if (row === undefined) return Promise.reject(new Error('email is not found'));
    return Promise.resolve(row.email);
  }).catch(function (error) {
    return Promise.reject(error);
  });
}

exports.createUser = createUser;
exports.activateUser = activateUser;
exports.authenticate = authenticate;
exports.validateEmail = validateEmail;