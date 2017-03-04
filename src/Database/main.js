var sqlite3 = require('sqlite3').verbose()

// import {addValidUser, allowThisUser} from './validateUser.js'
// import { storeActivationCode, verifyActivation } from './activation.js'

// import {createUser, activateUser, authenticate, validateEmail} from './authenticateUser.js'
// import {storeAuthCode, verifyAuthCode} from './authCode.js'
// import { storeResetCode, verifyResetCode, changePassword } from './resetCode.js'

class Database {
  constructor (config) {
    this.database = new sqlite3.Database(config.filename)
  }

  // mostly for testing
  get instance () {
    return this.database
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

  createTables () {
    let query = `
      CREATE TABLE validusers(email TEXT PRIMARY KEY NOT NULL);
      CREATE TABLE users(email TEXT PRIMARY KEY NOT NULL, password TEXT NOT NULL, active INTEGER NOT NULL);
      CREATE TABLE authcodes(code TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL);
      CREATE TABLE activationcodes(code TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL);
      CREATE TABLE resetcodes(code TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL);
    `
    return this.exec(query)
  }
}

Database.prototype.addValidUser = require('./validateUser.js').addValidUser
Database.prototype.allowThisUser = require('./validateUser.js').allowThisUser

Database.prototype.storeActivationCode = require('./activation.js').storeActivationCode
Database.prototype.verifyActivation = require('./activation.js').verifyActivation

Database.prototype.createUser = require('./authenticateUser.js').createUser
Database.prototype.activateUser = require('./authenticateUser.js').activateUser
Database.prototype.authenticate = require('./authenticateUser.js').authenticate
Database.prototype.validateEmail = require('./authenticateUser.js').validateEmail

Database.prototype.storeAuthCode = require('./authCode.js').storeAuthCode
Database.prototype.verifyAuthCode = require('./authCode.js').verifyAuthCode

Database.prototype.storeResetCode = require('./resetCode.js').storeResetCode
Database.prototype.verifyResetCode = require('./resetCode.js').verifyResetCode
Database.prototype.changePassword = require('./resetCode.js').changePassword

module.exports = Database
