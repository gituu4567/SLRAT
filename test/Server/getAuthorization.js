/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
const url = require('url')
import Server from '../../src/Server/main.js'

describe('getAuthorization', () => {
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
  let server

  let credential = {email: 'test@host.email', password: 'testshouldhavenone'}
  let cookieJar = request.jar()
  let loginReq = {
    method: 'POST',
    uri: `http://localhost:${config.server.port}/login`,
    form: credential,
    followRedirect: false,
    simple: false,
    resolveWithFullResponse: true,
    jar: cookieJar
  }

  let clientId = 'iAmYourClient'
  let redirectURI = 'http://www.example.com/service?with=value'
  let encodedRedirectURI = encodeURIComponent(redirectURI)
  // there is more like grant_type
  let authorizationQuery = `?client_id=${clientId}&redirect_uri=${encodedRedirectURI}`
  let authorizationReq = {
    method: 'GET',
    uri: `http://localhost:${config.server.port}/authorization${authorizationQuery}`,
    followRedirect: false,
    simple: false,
    resolveWithFullResponse: true,
    jar: cookieJar
  }

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

  it('should redirect to loginPage when user is not authenticated', () => {
    return request(authorizationReq)
    .then((response) => {
      assert.equal(response.statusCode, 302)
      assert.equal(response.headers.location, '/login')
    })
  })
  it('should redirect with authorization code when user is logged in', () => {
    return server.createUser(credential)
    .then(() => {
      return request(loginReq)
    })
    .then((response) => {
      assert.equal(response.statusCode, 302)
      return request(authorizationReq)
    })
    .then((response) => {
      assert.equal(response.statusCode, 302)
      let redirection = url.parse(response.headers.location, true)
      let authCode = redirection.query.code
      return server.verifyAuthCode(authCode)
    })
    .then((result) => {
      assert(result)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
