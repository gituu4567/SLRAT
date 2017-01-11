/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
import Server from '../../src/Server/main.js'

describe('postLogin', () => {
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

  it('should respond 401 when credential does not match', () => {
    let loginReq = {
      method: 'POST',
      uri: `http://localhost:${config.server.port}/login`,
      form: credential,
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    }
    return request(loginReq)
    .then((response) => {
      assert.equal(response.statusCode, 401)
    })
  })
})
