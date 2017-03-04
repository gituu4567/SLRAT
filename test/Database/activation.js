/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

describe('activation', () => {
  let config = {
    filename: ':memory:'
  }
  let database
  let code = 'takethecodeandbehappy'
  let email = 'wannabe@happy.com'

  beforeEach(() => {
    database = new Database(config)
  })

  afterEach(() => {
    database.close()
  })

  it('storeActivationCode() should throw error when "activationcodes" table is not found', () => {
    return database.storeActivationCode(code, email)
    .catch((error) => {
      assert.equal(error.message, 'no activationcodes table found')
    })
  })

  it('storeActivationCode() should add a code record', () => {
    return database.createTables()
    .then(() => {
      return database.storeActivationCode(code, email)
    })
    .then(() => {
      return database.get(`SELECT * FROM activationcodes WHERE code='${code}'`)
    })
    .then((row) => {
      assert(row)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('verifyActivation() should reject if code is not found', () => {
    return database.createTables()
    .then(() => {
      return database.verifyActivation(code)
    })
    .catch((error) => {
      assert.equal(error.message, 'activation code not found')
    })
  })

  it('verifyActivation() should resolve email if code is found', () => {
    return database.createTables()
    .then(() => {
      return database.storeActivationCode(code, email)
    })
    .then(() => {
      return database.verifyActivation(code)
    })
    .then((result) => {
      assert.equal(result, email)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
