const r = require('rethinkdb')

function createUser (credential) {
  return r.db('SLRAT').table('users').filter({contact: credential.contact}).count().run(this.connection)
  .then((count) => {
    if (count > 0) return Promise.reject(new Error('contact is already registered'))
    let user = Object.assign({}, credential)
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
    return Promise.resolve(true)
  })
  .catch((error) => {
    if (error.msg === 'Index out of bounds: 0') return Promise.reject(new Error('credential does not match'))
    return Promise.reject(error)
  })
}

module.exports = {createUser, authenticate}
