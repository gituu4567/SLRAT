/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

const r = require('rethinkdb')

describe('user creation', () => {
  let config = { address: 'rethinkdb' }
  let database

  let credential = {
    email: 'example@email.com',
    password: 'password'
  }

  before(() => {
    database = new Database(config)
    return database.connect()
  })

  after(() => {
    return database.connection.close()
  })

  it('createUser() should add a credential into users table', () => {
    return database.createUser(credential)
    .then((status) => {
      assert(status)
    })
  })

  it('createUser() should not add credential with duplicate email', () => {
    return database.createUser(credential)
    .catch((error) => {
      assert.equal(error.message, 'email is already registered')
    })
  })

  it('user should be inactive initially', () => {
    // TODO: database.findUser() ?
    return r.db('SLRAT').table('users').filter({email: credential.email}).nth(0).run(database.connection)
    .then((result) => {
      assert.equal(result.active, false)
    })
  })
})
