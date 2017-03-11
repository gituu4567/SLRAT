/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

describe('reset', () => {
  let config = { address: 'rethinkdb' }

  let database
  let code = 'takethecodeandbehappy'
  let contact = 'test@example.com'

  before(() => {
    database = new Database(config)
    return database.connect()
  })

  after(() => {
    return database.connection.close()
  })

  it('validateContact() should reject if no contact is found', () => {
    return database.validateContact(contact)
    .then(() => {
      assert(false)
    })
    .catch((error) => {
      assert.equal(error.message, 'contact is not registered')
    })
  })

  it('validateContact() should resolve if email is found', () => {
    let registeredEmail = 'example@email.com' // NOTE: this email is registered with previous test
    return database.validateContact(registeredEmail)
    .then((result) => {
      assert(result)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('changePassword() should reject if email is not found', () => {
    let password = 'newpassword'
    return database.changePassword(contact, password)
    .then(() => {
      assert(false)
    })
    .catch((error) => {
      assert.equal(error.message, 'contact is not registered')
    })
  })

  it('changePassword() should update password of a user', () => {
    let registeredEmail = 'example@email.com' // NOTE: this email is registered with previous test
    let password = 'newpassword'
    return database.changePassword(registeredEmail, password)
    .then((result) => {
      assert(result)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('verifyResetCode() should reject if code is not found', () => {
    return database.verifyResetCode(code)
    .catch((error) => {
      assert.equal(error.message, 'reset code not found')
    })
  })

  it('storeResetCode() should add a code', () => {
    return database.storeResetCode(code, contact)
    .then((result) => {
      assert(result)
    })
  })

  it('verifyResetCode() should resolve email if code is found', () => {
    return database.verifyResetCode(code)
    .then((result) => {
      assert.equal(result, contact)
    })
  })

  it('should delete this code right after', () => {
    return database.verifyResetCode(code)
    .then(() => {
      assert(false)
    })
    .catch((error) => {
      assert.equal(error.message, 'reset code not found')
    })
  })
})
