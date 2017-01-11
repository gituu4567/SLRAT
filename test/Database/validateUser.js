/* eslint-env mocha */
const assert = require('assert')
import Database from '../../src/Database/main.js'

describe('validateUser', () => {
  let config = {
    filename: ':memory:'
  }

  let database
  beforeEach(() => {
    database = new Database(config)
  })

  afterEach(() => {
    database.close()
  })

  it('addValidUser should throw error when no "validusers" table is found', () => {
    return database.addValidUser('example@email.com')
    .catch((error) => {
      assert.equal(error.message, 'no validusers table found')
    })
  })
  it('addValidUser should add email to validuser table', () => {
    let email = 'example@email.com'

    return database.createTables()
    .then(() => {
      return database.addValidUser(email)
    })
    .then((result) => {
      assert(result)
      return database.get('SELECT email FROM validusers')
    })
    .then((row) => {
      assert.equal(row.email, email)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
  it('allowThisUser should throw error when no "validusers" table is found', () => {
    let email = 'example@email.com'
    return database.allowThisUser(email)
    .catch((error) => {
      assert(error.message === 'no validusers table found, when checking if email is valid')
    })
  })
  it('allowThisUser should return true if validuser table has such email', () => {
    let email = 'example@email.com'
    return database.createTables()
    .then(() => {
      return database.addValidUser(email)
    })
    .then(() => {
      return database.allowThisUser('example@email.com')
    })
    .then((result) => {
      assert(result)
    })
  })
  it('allowThisUser should return false if validuser table does not have such email', () => {
    return database.createTables()
    .then(() => {
      return database.allowThisUser('example@email.com')
    })
    .catch((error) => {
      assert.equal(error.message, 'email is not allowed to register')
    })
  })
})
