var r = require('rethinkdb')

class Database {
  constructor (config) {
    this.address = config.address
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
      return r.db('SLRAT').tableCreate('users').run(this.connection)
    })
    .then(() => {
      return r.db('SLRAT').tableCreate('verification').run(this.connection)
    })
    .then(() => {
      return r.db('SLRAT').tableCreate('authcodes').run(this.connection)
    })
    .then(() => {
      return r.db('SLRAT').tableCreate('activationcodes').run(this.connection)
    })
    .then(() => {
      return r.db('SLRAT').tableCreate('resetcodes').run(this.connection)
    })
    .then(() => {
      return Promise.resolve(true)
    })
    .catch((error) => {
      if (error.msg === 'Database `SLRAT` already exists.') return Promise.resolve(true)
      return Promise.reject(error)
    })
  }

  exec (query) {
    return new Promise((resolve, reject) => {
      this.database.exec(query, (err) => {
        if (!err) resolve(true)
        if (err) reject(err)
      })
    })
  }

  get (query) {
    return new Promise((resolve, reject) => {
      this.database.get(query, (error, row) => {
        if (!error) resolve(row)
        if (error) reject(error)
      })
    })
  }

  close (cb) {
    this.database.close(cb)
  }
}

Database.prototype.addValidUser = require('./validateUser.js').addValidUser
Database.prototype.allowThisUser = require('./validateUser.js').allowThisUser

Database.prototype.generateVerificationCode = require('./verification.js').generateVerificationCode
Database.prototype.verifyCode = require('./verification.js').verifyCode

Database.prototype.storeActivationCode = require('./activation.js').storeActivationCode
Database.prototype.verifyActivation = require('./activation.js').verifyActivation

Database.prototype.createUser = require('./authenticateUser.js').createUser
Database.prototype.activateUser = require('./authenticateUser.js').activateUser
Database.prototype.authenticate = require('./authenticateUser.js').authenticate
Database.prototype.validateContact = require('./authenticateUser.js').validateContact

Database.prototype.storeAuthCode = require('./authCode.js').storeAuthCode
Database.prototype.verifyAuthCode = require('./authCode.js').verifyAuthCode

Database.prototype.storeResetCode = require('./resetCode.js').storeResetCode
Database.prototype.verifyResetCode = require('./resetCode.js').verifyResetCode
Database.prototype.changePassword = require('./resetCode.js').changePassword

module.exports = Database
