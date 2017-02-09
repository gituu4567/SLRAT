function storeAuthCode (code, email) {
  let query = `INSERT INTO authcodes (code, email) VALUES ('${code}', '${email}')`

  return this.exec(query)
  .then((result) => {
    return Promise.resolve(result)
  })
  .catch((error) => {
    if (error.message === 'SQLITE_ERROR: no such table: authcodes') {
      return Promise.reject(new Error('no authcodes table found'))
    }
  })
}

function verifyAuthCode (code) {
  let query = `SELECT email FROM authcodes WHERE code='${code}'`

  return new Promise((resolve, reject) => {
    this.database.get(query, (error, row) => {
      if (error) reject(error)
      if (!error) {
        if (row === undefined) reject(new Error('authorization code not found'))
        if (row) resolve(row.email)
      }
    })
  })
}

export {storeAuthCode, verifyAuthCode}
