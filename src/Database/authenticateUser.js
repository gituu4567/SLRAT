const r = require('rethinkdb')

function createUser (credential) {
  return r.db('SLRAT').table('users').filter({email: credential.email}).count().run(this.connection)
  .then((count) => {
    if (count > 0) return Promise.reject(new Error('email is already registered'))
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

function activateUser (user) {
  return r.db('SLRAT').table('users').filter({email: user})(0).update({active: true}).run(this.connection)
  .then((result) => {
    if (result.replaced === 1) return Promise.resolve(true)
    return Promise.reject(false)
  })
  .catch((error) => {
    return Promise.reject(error)
  })
}

function validateEmail (email) {
  return r.db('SLRAT').table('users').filter({email})(0).run(this.connection)
  .then((doc) => {
    return Promise.resolve(email)
  })
  .catch((error) => {
    if (error.msg === 'Index out of bounds: 0') return Promise.reject(new Error('email is not registered'))
    return Promise.reject(error)
  })
}

module.exports = {createUser, activateUser, authenticate, validateEmail}
