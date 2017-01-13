function storeAuthCode (code) {
  let query = `INSERT INTO authcodes (code) VALUES ('${code}')`

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
  let query = `SELECT * FROM authcodes WHERE code='${code}'`

  return new Promise((resolve, reject) => {
    this.database.get(query, (error, row) => {
      if (error) reject(error)
      if (!error) {
        if (row === undefined) reject(new Error('authorization code not found'))
        if (row) resolve(true)
      }
    })
  })
}

export {storeAuthCode, verifyAuthCode}
