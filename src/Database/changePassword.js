const r = require('rethinkdb')

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

module.exports = changePassword
