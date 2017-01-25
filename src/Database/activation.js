function storeActivationCode (code) {
  let query = `INSERT INTO activationcodes (code) VALUES ('${code}')`

  return this.exec(query)
  .then((result) => {
    return Promise.resolve(result)
  })
  .catch((error) => {
    if (error.message === 'SQLITE_ERROR: no such table: activationcodes') {
      return Promise.reject(new Error('no activationcodes table found'))
    }
  })
}

function verifyActivation (code) {
  let query = `SELECT * FROM activationcodes WHERE code='${code}'`

  return new Promise((resolve, reject) => {
    this.database.get(query, (error, row) => {
      if (error) reject(error)
      if (!error) {
        if (row === undefined) reject(new Error('activation code not found'))
        if (row) resolve(true)
      }
    })
  })
}

export {storeActivationCode, verifyActivation}
