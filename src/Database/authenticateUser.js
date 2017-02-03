function createUser (credential) {
  let query = `INSERT INTO users (email, password, active) VALUES ('${credential.email}', '${credential.password}', 0)`

  return this.exec(query)
  .then((result) => {
    return Promise.resolve(true)
  })
  .catch((error) => {
    if (error.message === 'SQLITE_ERROR: no such table: users') {
      return Promise.reject(new Error('no user table found'))
    }
  })
}

function authenticate (credential) {
  let query = `SELECT email, active From users WHERE email='${credential.email}' AND password='${credential.password}'`
  return this.get(query)
  .then((row) => {
    if (row === undefined) return Promise.reject(new Error('credential does not match'))
    if (!row.active) return Promise.reject(new Error('user is not active'))
    return Promise.resolve(row.email)
  })
  .catch((error) => {
    if (error.message === 'SQLITE_ERROR: no such table: users') return Promise.reject(new Error('no user table found'))
    return Promise.reject(error)
  })
}

function activateUser (user) {
  let query = `UPDATE users SET active=1 WHERE email='${user}'`

  return this.exec(query)
}

function validateEmail (email) {
  let query = `SELECT email FROM users WHERE email='${email}'`

  return this.get(query)
  .then((row) => {
    if (row === undefined) return Promise.reject(new Error('email is not found'))
    return Promise.resolve(row.email)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

export {createUser, activateUser, authenticate, validateEmail}
