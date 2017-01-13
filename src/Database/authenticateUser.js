function createUser (credential) {
  let query = `INSERT INTO users (email, password) VALUES ('${credential.email}', '${credential.password}')`

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
  let query = `SELECT email From users WHERE email='${credential.email}' AND password='${credential.password}'`

  return this.get(query)
  .then((row) => {
    if (row === undefined) return Promise.reject(new Error('credential does not match'))
    return Promise.resolve(row.email)
  })
  .catch((error) => {
    if (error.message === 'SQLITE_ERROR: no such table: users') return Promise.reject(new Error('no user table found'))
    return Promise.reject(error)
  })
}

export {createUser, authenticate}
