/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

describe('authorization', () => {
  let config = { address: 'rethinkdb' }

  let database
  let code = 'takethecodeandbehappy'
  let email = 'test@example.com'

  before(() => {
    database = new Database(config)
    return database.connect()
  })

  after(() => {
    return database.connection.close()
  })

  it('verifyAuthCode() should reject if authcode is not found', () => {
    return database.verifyAuthCode(code)
    .catch((error) => {
      assert.equal(error.message, 'authorization code not found')
    })
  })

  it('storeAuthCode() should add a code', () => {
    return database.storeAuthCode(code, email)
    .then((result) => {
      assert(result)
    })
  })

  it('verifyAuthCode() should resolve email if authcode is found', () => {
    return database.verifyAuthCode(code)
    .then((result) => {
      assert.equal(result, email)
    })
  })

  it('verifyAuthCode() should delete this code right after', () => {
    return database.verifyAuthCode(code)
    .then(() => {
      assert(false)
    })
    .catch((error) => {
      assert.equal(error.message, 'authorization code not found')
    })
  })
})
