const r = require('rethinkdb')

function storeAuthCode (code, email) {
  return r.db('SLRAT').table('authcodes').insert({ id: code, email }).run(this.connection)
  .then((result) => {
    if (result.inserted === 1) return Promise.resolve(true)
    return Promise.reject(new Error('authcode not inserted'))
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function verifyAuthCode (code) {
  let email
  return r.db('SLRAT').table('authcodes').get(code).run(this.connection)
  .then((doc) => {
    if (!doc) return Promise.reject(new Error('authorization code not found'))
    email = doc.email
    return r.db('SLRAT').table('authcodes').get(doc.id).delete().run(this.connection)
  })
  .then((result) => {
    if (result.deleted === 1) return Promise.resolve(email)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

module.exports = {storeAuthCode, verifyAuthCode}
