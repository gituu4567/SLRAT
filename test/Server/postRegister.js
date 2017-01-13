/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
import Server from '../../src/Server/main.js'

describe('postRegister', () => {
  let config = {
    database: {
      filename: ':memory:'
    },
    server: {
      port: 3000,
      session: {
        secret: 'the answer is 42',
        resave: false,
        saveUninitialized: true,
        cookie: {}
      }
    }
  }
  let credential = {email: 'test@email.host', password: 'testshouldhavenone'}
  let registerReq = {
    method: 'POST',
    uri: `http://localhost:${config.server.port}/register`,
    form: credential,
    followRedirect: false,
    simple: false,
    resolveWithFullResponse: true
  }
  let server

  beforeEach(() => {
    server = new Server(config)
    return server.listenOnEndPoint()
    .then(() => {
      return server.start()
    })
  })

  afterEach(() => {
    return server.stop()
  })

  it('should respond 200 on successful user creation', () => {
    return request(registerReq)
    .then((response) => {
      assert(response.statusCode, 200)
    })
  })
})
