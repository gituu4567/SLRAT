/* eslint-env mocha */
const assert = require('assert')
const Database = require('../../src/Database/main.js')

const r = require('rethinkdb')

describe('whiteListed', () => {
  let config = { address: 'rethinkdb' }
  let database
  before(() => {
    database = new Database(config, true)
    return database.connect()
  })

  after(() => {
    return database.connection.close()
  })

  it('should reject if contact can not be found in whitelist table', () => {
    return database.whiteListed('uncool@user.com')
    .then(() => {
      throw new Error('should not resolve')
    })
    .catch((error) => {
      assert.equal(error.message, 'contact not found in whitelist')
    })
  })
  it('should resolve if contact is found in whitelist table', () => {
    return r.db('SLRAT').table('whitelist').insert({contact: 'cool@user.com'}).run(database.connection)
    .then(() => {
      return database.whiteListed('cool@user.com')
    })
    .then((result) => {
      assert(result)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
