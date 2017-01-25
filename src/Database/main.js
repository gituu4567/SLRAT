var sqlite3 = require('sqlite3').verbose()

import {addValidUser, allowThisUser} from './validateUser.js'
import {createUser, activateUser, authenticate} from './authenticateUser.js'
import {storeAuthCode, verifyAuthCode} from './authCode.js'

class database {
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
      CREATE TABLE authcodes(code TEXT PRIMARY KEY NOT NULL);
      CREATE TABLE activationcodes(code TEXT PRIMARY KEY NOT NULL);
    `
    return this.exec(query)
  }
}

database.prototype.addValidUser = addValidUser
database.prototype.allowThisUser = allowThisUser
database.prototype.createUser = createUser
database.prototype.activateUser = activateUser
database.prototype.authenticate = authenticate
database.prototype.storeAuthCode = storeAuthCode
database.prototype.verifyAuthCode = verifyAuthCode

export default database
