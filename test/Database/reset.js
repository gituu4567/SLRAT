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
})
