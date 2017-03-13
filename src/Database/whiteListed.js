const r = require('rethinkdb')

module.exports = function whiteListed (contact) {
  return r.db('SLRAT').table('whitelist').filter({contact})(0).run(this.connection)
  .then(() => {
    return Promise.resolve(true)
  })
  .catch((error) => {
    if (error.msg === 'Index out of bounds: 0') return Promise.reject(new Error('contact not found in whitelist'))
    return Promise.reject(error)
  })
}
