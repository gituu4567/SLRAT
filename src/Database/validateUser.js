function addValidUser (email) {
  let query = `INSERT INTO validusers (email) VALUES ('${email}')`

  return this.exec(query)
  .then((result) => {
    return Promise.resolve(result)
  })
  .catch((error) => {
    if (error.message === 'SQLITE_ERROR: no such table: validusers') {
      return Promise.reject(new Error('no validusers table found'))
    }
  })
}

function allowThisUser (email) {
  let query = `SELECT email FROM validusers WHERE email='${email}'`

  return new Promise(function (resolve, reject) {
    this.database.get(query, (error, rows) => {
      if (error) {
        if (error.message === 'SQLITE_ERROR: no such table: validusers') reject(new Error('no validusers table found, when checking if email is valid'))
      } else {
        if (rows === undefined) {
          reject(new Error('email is not allowed to register'))
        } else if (rows.email === email) {
          resolve(true)
        }
      }
    })
  }.bind(this))
}

module.exports = {addValidUser, allowThisUser}
