/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

describe('activation', () => {
  let config = { address: 'rethinkdb' }
  let database

  let code = 'takethecodeandbehappy'
  let email = 'wannabe@happy.com'

  before(() => {
    database = new Database(config)
    return database.connect()
  })

  after(() => {
    return database.connection.close()
  })

  // beforeEach(() => {
  //   database = new Database(config)
  // })
  //
  // afterEach(() => {
  //   database.close()
  // })

  // it('storeActivationCode() should throw error when "activationcodes" table is not found', () => {
  //   return database.storeActivationCode(code, email)
  //   .catch((error) => {
  //     assert.equal(error.message, 'no activationcodes table found')
  //   })
  // })

  it('verifyActivation() should reject if code is not found', () => {
    return database.verifyActivation(code)
    .then(() => {
      assert(false)
    })
    .catch((error) => {
      assert.equal(error.message, 'activation code not found')
    })
  })

  it('storeActivationCode() should add code to table', () => {
    return database.storeActivationCode(code, email)
    .then((result) => {
      assert(result)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('verifyActivation() should resolve email if code is found', () => {
    return database.verifyActivation(code)
    .then((verifiedEmail) => {
      assert.equal(verifiedEmail, email)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('verifyActivation() should delete this code right after', () => {
    return database.verifyActivation(code)
    .then(() => {
      assert(false)
    })
    .catch((error) => {
      assert.equal(error.message, 'activation code not found')
    })
  })
})
