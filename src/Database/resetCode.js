const r = require('rethinkdb')

function storeResetCode (code, contact) {
  return r.db('SLRAT').table('resetcodes').insert({ id: code, contact }).run(this.connection)
  .then((result) => {
    if (result.inserted === 1) return Promise.resolve(true)
    return Promise.reject(new Error('resetcode not inserted'))
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function verifyResetCode (code) {
  let contact
  return r.db('SLRAT').table('resetcodes').get(code).run(this.connection)
  .then((doc) => {
    if (!doc) return Promise.reject(new Error('reset code not found'))
    contact = doc.contact
    return r.db('SLRAT').table('resetcodes').get(doc.id).delete().run(this.connection)
  })
  .then((result) => {
    if (result.deleted === 1) return Promise.resolve(contact)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function changePassword (contact, password) {
  return r.db('SLRAT').table('users').filter({contact})(0).run(this.connection)
  .then((doc) => {
    return r.db('SLRAT').table('users').get(doc.id).update({password}).run(this.connection)
  })
  .then((result) => {
    return Promise.resolve(true)
  })
  .catch((error) => {
    if (error.msg === 'Index out of bounds: 0') return Promise.reject(new Error('contact is not registered'))
    return Promise.reject(error)
  })
}

module.exports = {storeResetCode, verifyResetCode, changePassword}
