var r = require('rethinkdb')

function storeActivationCode (code, contact) {
  return r.db('SLRAT').table('activationcodes').insert({id: code, contact}).run(this.connection)
  .then((result) => {
    return Promise.resolve(true)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function verifyActivation (code) {
  let contact
  return r.db('SLRAT').table('activationcodes').get(code).run(this.connection)
  .then((doc) => {
    if (!doc) return Promise.reject(new Error('activation code not found'))
    contact = doc.contact

    return r.db('SLRAT').table('activationcodes').get(code).delete().run(this.connection)
  })
  .then((result) => {
    if (result.deleted === 1) return Promise.resolve(contact)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

module.exports = {storeActivationCode, verifyActivation}
