/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

describe('reset', () => {
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

  it('storeResetCode() should throw error when "activationcodes" table is not found', () => {
    return database.storeResetCode(code, email)
    .catch((error) => {
      assert.equal(error.message, 'no resetcodes table found')
    })
  })

  it('storeResetCode() should add a code record', () => {
    return database.createTables()
    .then(() => {
      return database.storeResetCode(code, email)
    })
    .then(() => {
      return database.get(`SELECT * FROM resetcodes WHERE code='${code}'`)
    })
    .then((row) => {
      assert(row)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('verifyResetCode() should reject if code is not found', () => {
    return database.createTables()
    .then(() => {
      return database.verifyResetCode(code)
    })
    .catch((error) => {
      assert.equal(error.message, 'reset code not found')
    })
  })

  it('verifyResetCode() should resolve email if code is found', () => {
    return database.createTables()
    .then(() => {
      return database.storeResetCode(code, email)
    })
    .then(() => {
      return database.verifyResetCode(code)
    })
    .then((result) => {
      assert.equal(result, email)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
