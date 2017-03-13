var r = require('rethinkdb')

class Database {
  constructor (config, whitelist) {
    this.address = config.address
    this.whiteListed = (whitelist) ? require('./whiteListed.js').bind(this) : () => Promise.resolve(true)
    this.generateVerificationCode = require('./verification.js').generateVerificationCode.bind(this)
    this.verifyCode = require('./verification.js').verifyCode.bind(this)
    this.createUser = require('./authenticateUser.js').createUser.bind(this)
    this.authenticate = require('./authenticateUser.js').authenticate.bind(this)
    this.storeAuthCode = require('./authCode.js').storeAuthCode.bind(this)
    this.verifyAuthCode = require('./authCode.js').verifyAuthCode.bind(this)
    this.changePassword = require('./changePassword.js').bind(this)
  }

  connect () {
    return r.connect(this.address)
    .then((connection) => {
      this.connection = connection
    })
    .catch((error) => {
      return Promise.reject(error)
    })
  }

  init () {
    return r.dbCreate('SLRAT').run(this.connection)
    .then(() => {
      return r.db('SLRAT').tableCreate('whitelist').run(this.connection)
    })
    .then(() => {
      return r.db('SLRAT').tableCreate('users').run(this.connection)
    })
    .then(() => {
      return r.db('SLRAT').tableCreate('verification').run(this.connection)
    })
    .then(() => {
      return r.db('SLRAT').tableCreate('authcodes').run(this.connection)
    })
    .then(() => {
      return Promise.resolve(true)
    })
    .catch((error) => {
      if (error.msg === 'Database `SLRAT` already exists.') return Promise.resolve(true)
      return Promise.reject(error)
    })
  }
}

module.exports = Database
