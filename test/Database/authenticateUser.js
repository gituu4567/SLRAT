/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

describe('authentication', () => {
  let config = { address: 'rethinkdb' }
  let database

  let credential = {
    email: 'example@authenticate.com',
    password: 'password'
  }

  before(() => {
    database = new Database(config)
    return database.connect()
  })

  after(() => {
    return database.connection.close()
  })

  it('authenticate() should reject if credential does not match', () => {
    return database.authenticate(credential)
    .catch((error) => {
      assert.equal(error.message, 'credential does not match')
    })
  })

  it('authenticate() should reject if user is not activated', () => {
    return database.createUser(credential)
    .then(() => {
      return database.authenticate(credential)
    })
    .catch((error) => {
      assert.equal(error.message, 'user is not active')
    })
  })

  it('activateUser() should set user active', () => {
    return database.activateUser(credential.email)
    .then((result) => {
      assert(result)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('authenticate should resolve true after user is activated', () => {
    return database.authenticate(credential)
    .then((result) => {
      assert(result)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
