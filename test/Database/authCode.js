/* eslint-env mocha */
const assert = require('assert')
import Database from '../../src/Database/main.js'

describe('AuthCode', () => {
  let config = {
    filename: ':memory:'
  }
  let database
  let code = 'takethecodeandbehappy'

  beforeEach(() => {
    database = new Database(config)
  })

  afterEach(() => {
    database.close()
  })

  it('storeAuthCode() should throw error when no "authcodes" table is found', () => {
    return database.storeAuthCode(code)
    .catch((error) => {
      assert.equal(error.message, 'no authcodes table found')
    })
  })

  it('storeAuthCode() should add a signature record', () => {
    return database.createTables()
    .then(() => {
      return database.storeAuthCode(code)
    })
    .then(() => {
      return database.get(`SELECT * FROM authcodes WHERE code='${code}'`)
    })
    .then((row) => {
      assert(row)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('verifyAuthCode() should reject if authcode is not found', () => {
    return database.createTables()
    .then(() => {
      return database.verifyAuthCode(code)
    })
    .catch((error) => {
      assert.equal(error.message, 'authorization code not found')
    })
  })

  it('verifyAuthCode() should resolve if authcode is found', () => {
    return database.createTables()
    .then(() => {
      return database.storeAuthCode(code)
    })
    .then(() => {
      return database.verifyAuthCode(code)
    })
    .then((result) => {
      assert(result)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
