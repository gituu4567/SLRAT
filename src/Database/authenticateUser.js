const r = require('rethinkdb')

function createUser (credential) {
  return r.db('SLRAT').table('users').filter({contact: credential.contact}).count().run(this.connection)
  .then((count) => {
    if (count > 0) return Promise.reject(new Error('contact is already registered'))
    let user = Object.assign({}, credential)
    user.active = false
    return r.db('SLRAT').table('users').insert(user).run(this.connection)
  })
  .then(() => {
    return Promise.resolve(true)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function authenticate (credential) {
  return r.db('SLRAT').table('users').filter(credential)(0).run(this.connection)
  .then((doc) => {
    if (!doc.active) return Promise.reject(new Error('user is not active'))
    return Promise.resolve(true)
  })
  .catch((error) => {
    if (error.msg === 'Index out of bounds: 0') return Promise.reject(new Error('credential does not match'))
    return Promise.reject(error)
  })
}

function activateUser (contact) {
  return r.db('SLRAT').table('users').filter({contact})(0).update({active: true}).run(this.connection)
  .then((result) => {
    if (result.replaced === 1) return Promise.resolve(true)
    return Promise.reject(false)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function validateContact (contact) {
  return r.db('SLRAT').table('users').filter({contact})(0).run(this.connection)
  .then((doc) => {
    return Promise.resolve(contact)
  })
  .catch((error) => {
    if (error.msg === 'Index out of bounds: 0') return Promise.reject(new Error('contact is not registered'))
    return Promise.reject(error)
  })
}

module.exports = {createUser, activateUser, authenticate, validateContact}
