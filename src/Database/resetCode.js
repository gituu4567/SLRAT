function storeResetCode (code, email) {
  let query = `INSERT INTO resetcodes (code, email) VALUES ('${code}','${email}')`

  return this.exec(query)
  .then((result) => {
    return Promise.resolve(result)
  })
  .catch((error) => {
    if (error.message === 'SQLITE_ERROR: no such table: activationcodes') {
      return Promise.reject(new Error('no resetcodes table found'))
    }
  })
}

function verifyResetCode (code) {
  let query = `SELECT email FROM resetcodes WHERE code='${code}'`

  return this.get(query)
  .then((row) => {
    if (row === undefined) return Promise.reject(new Error('reset code not found'))
    return Promise.resolve(row.email)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function changePassword (email, password) {
  let query = `UPDATE users SET password='${password}' WHERE email='${email}'`

  return this.exec(query)
  .then((result) => {
    return Promise.resolve(result)
  })
  .catch((error) => {
    return Promise.reject(new Error(error))
  })
}

export {storeResetCode, verifyResetCode, changePassword}
