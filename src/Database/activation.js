var r = require('rethinkdb')

function storeActivationCode (code, email) {
  return r.db('SLRAT').table('activationcodes').insert({code, email}).run(this.connection)
  .then((result) => {
    return Promise.resolve(true)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function verifyActivation (code) {
  let email
  return r.db('SLRAT').table('activationcodes').filter({code}).run(this.connection)
  .then((result) => {
    return result.next()
  })
  .then((row) => {
    email = row.email
    return r.db('SLRAT').table('activationcodes').get(row.id).delete().run(this.connection)
  })
  .then(() => {
    return Promise.resolve(email)
  })
  .catch((error) => {
    if (error.msg === 'No more rows in the cursor.') return Promise.reject(new Error('activation code not found'))
    throw new Error(error)
  })
}

module.exports = {storeActivationCode, verifyActivation}
