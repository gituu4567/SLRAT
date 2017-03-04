/* eslint-env mocha */
const assert = require('assert')
const Database = require('../src/Database/main.js')

const r = require('rethinkdb')

describe.skip('Mailer', () => { // dont want to spam any one yet
  require('./Mailer/main.js')
})

describe.only('Database', () => {
  // require('./Database/init.js')
  // require('./Database/validateUser.js')
  // require('./Database/activation.js')
  // require('./Database/authenticateUser.js')
  // require('./Database/authCode.js')
  // require('./Database/resetCode.js')
  let config = { address: 'rethinkdb' }
  let database = new Database(config)

  before(() => {
    // return database.init()
    return database.connect()
  })

  it('should connect', () => {
    assert(database.connection)
  })

  it('init should create necessary tables', () => {
    return database.init()
    .then(() => {
      assert(true)
    })
  })

  // require('./Database/createUser.js')
  require('./Database/activation.js')

  after(() => {
    return r.dbDrop('SLRAT').run(database.connection)
    .then(() => {
      return database.connection.close()
    })
  })
})

describe('Server', () => {
  require('./Server/init.js')
  require('./Server/getRoot.js')
  require('./Server/postLogin.js')
  require('./Server/postRegister.js')
  require('./Server/getActivate.js')
  require('./Server/getAuthorization.js')
  require('./Server/postNewPassword.js')
  require('./Server/postToken.js')
  require('./Server/postReset.js')
})
