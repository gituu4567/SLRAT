/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

// const r = require('rethinkdb')
const scenarios = require('../scenarios.js')

describe('verification', () => {
  let config = { address: 'rethinkdb' }
  let database

  let contact = {mobile: '110'}
  let verificationCode

  before(() => {
    database = new Database(config)
    return database.connect()
  })

  after(() => {
    return database.connection.close()
  })

  it('insert an unique code', () => {
    return database.generateVerificationCode(contact)
    .then((code) => {
      assert(code)
      verificationCode = code
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('verifyCode() should reject if code is not found ', () => {
    database.verifyCode('awrontcode')
    .catch((error) => {
      assert.equal(error.message, 'invalid verification code')
    })
  })

  it('verifyCode() should resolve contact', () => {
    database.verifyCode(verificationCode)
    .then((result) => {
      assert.deepEqual(result, contact)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
