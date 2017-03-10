/* eslint-env mocha */
const assert = require('assert')
const Database = require('../src/Database/main.js')
const Server = require('../src/Server/main.js')
const config = require('./config.js')

const r = require('rethinkdb')
const http = require('http')

const sinon = require('sinon')

describe('Database', () => {
  let config = { address: 'rethinkdb' }
  let database = new Database(config)

  before(() => {
    return database.connect()
    .then(() => {
      return database.init()
    })
  })

  it('should establish a connection', () => {
    assert(database.connection)
  })

  it('init should create necessary tables', () => {
    return r.db('SLRAT').tableList().run(database.connection)
    .then((tables) => {
      assert(tables.find((v) => v === 'users'))
      assert(tables.find((v) => v === 'activationcodes'))
      assert(tables.find((v) => v === 'authcodes'))
      assert(tables.find((v) => v === 'resetcodes'))
      assert(tables.find((v) => v === 'verification'))
    })
  })

  require('./Database/createUser.js')
  require('./Database/verification.js')
  require('./Database/authenticateUser.js')
  require('./Database/activation.js')
  require('./Database/authorization.js')
  require('./Database/reset.js')

  after(() => {
    return r.dbDrop('SLRAT').run(database.connection)
    .then(() => {
      return database.connection.close()
    })
  })
})

describe('Server', () => {
  let server = new Server(config)
  server.sendActivation = sinon.stub().returns(Promise.resolve(true))
  server.sendReset = sinon.stub().returns(Promise.resolve(true))

  let httpServer

  before((done) => {
    server.init()
    .then(() => {
      httpServer = http.createServer(server.endPoints)
      httpServer.listen(config.server.port, () => {
        done()
      })
    })
  })

  it('init should establish database connection', () => {
    assert(server.connection)
  })

  it('should create necessary tables', () => {
    return r.db('SLRAT').tableList().run(server.connection)
    .then((tables) => {
      assert(tables.find((v) => v === 'users'))
      assert(tables.find((v) => v === 'activationcodes'))
      assert(tables.find((v) => v === 'authcodes'))
      assert(tables.find((v) => v === 'resetcodes'))
    })
  })

  require('./Server/postRegister.js')(server)
  require('./Server/getActivate.js')
  require('./Server/postLogin.js')
  require('./Server/getAuthorization.js')
  require('./Server/postToken.js')
  require('./Server/postReset.js')(server)
  require('./Server/postNewPassword.js')
  require('./Server/getRoot.js')

  after((done) => {
    r.dbDrop('SLRAT').run(server.connection)
    .then(() => {
      return server.connection.close()
    })
    .then(() => {
      httpServer.close(() => {
        done()
      })
    })
  })
})
