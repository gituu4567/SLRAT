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
  let loginReq = {
    method: 'POST',
    uri: `http://localhost:${config.server.port}/login`,
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

  it('should respond 401 when credential does not match', () => {
    return request(loginReq)
    .then((response) => {
      assert.equal(response.statusCode, 401)
    })
  })
  it('should redirect to / when credential is authenticated', () => {
    return server.createUser(credential)
    .then(() => {
      return server.activateUser(credential.email)
    })
    .then(() => {
      return request(loginReq)
    })
    .then((response) => {
      assert.equal(response.statusCode, 302)
      assert.equal(response.headers.location, '/')
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
  it('should redirect to /authorization if "redirect_uri paramenter" is present', () => {
    let clientRedirect = 'http://www.client.com/service?with=value'
    loginReq.uri = `http://localhost:${config.server.port}/login?redirect_uri=${encodeURIComponent(clientRedirect)}`
    return server.createUser(credential)
    .then(() => {
      return server.activateUser(credential.email)
    })
    .then(() => {
      return request(loginReq)
    })
    .then((response) => {
      assert.equal(response.statusCode, 302)
      assert.equal(response.headers.location, `/authorization?redirect_uri=${clientRedirect}`)
    })
  })
})
