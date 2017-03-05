const r = require('rethinkdb')

function storeResetCode (code, email) {
  return r.db('SLRAT').table('resetcodes').insert({ id: code, email }).run(this.connection)
  .then((result) => {
    if (result.inserted === 1) return Promise.resolve(true)
    return Promise.reject(new Error('resetcode not inserted'))
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function verifyResetCode (code) {
  let email
  return r.db('SLRAT').table('resetcodes').get(code).run(this.connection)
  .then((doc) => {
    if (!doc) return Promise.reject(new Error('reset code not found'))
    email = doc.email
    return r.db('SLRAT').table('resetcodes').get(doc.id).delete().run(this.connection)
  })
  .then((result) => {
    if (result.deleted === 1) return Promise.resolve(email)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function changePassword (email, password) {
  return r.db('SLRAT').table('users').filter({email})(0).run(this.connection)
  .then((doc) => {
    return r.db('SLRAT').table('users').get(doc.id).update({password}).run(this.connection)
  })
  .then((result) => {
    if (result.replaced === 1) return Promise.resolve(true)
    return Promise.reject('password not updated')
  })
  .catch((error) => {
    if (error.msg === 'Index out of bounds: 0') return Promise.reject(new Error('email is not registered'))
    return Promise.reject(error)
  })
}

module.exports = {storeResetCode, verifyResetCode, changePassword}
