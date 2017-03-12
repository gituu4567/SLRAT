/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

describe('authentication', () => {
  let config = { address: 'rethinkdb' }
  let database

  let credential = {
    contact: 'example@email.com',
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
    return database.authenticate({contact: 'iam@bad.com', password: 'hacked'})
    .then(() => {
      throw new Error('should not resolve')
    })
    .catch((error) => {
      assert.equal(error.message, 'credential does not match')
    })
  })

  it('authenticate should resolve true when credential matches', () => {
    return database.authenticate(credential)
    .then((result) => {
      assert(result)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
