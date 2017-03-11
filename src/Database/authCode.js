const r = require('rethinkdb')

function storeAuthCode (code, contact) {
  return r.db('SLRAT').table('authcodes').insert({ id: code, contact }).run(this.connection)
  .then((result) => {
    if (result.inserted === 1) return Promise.resolve(true)
    return Promise.reject(new Error('authcode not inserted'))
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function verifyAuthCode (code) {
  let contact
  return r.db('SLRAT').table('authcodes').get(code).run(this.connection)
  .then((doc) => {
    if (!doc) return Promise.reject(new Error('authorization code not found'))
    contact = doc.contact
    return r.db('SLRAT').table('authcodes').get(doc.id).delete().run(this.connection)
  })
  .then((result) => {
    if (result.deleted === 1) return Promise.resolve(contact)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

module.exports = {storeAuthCode, verifyAuthCode}
