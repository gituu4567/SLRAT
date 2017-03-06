/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
const url = require('url')

const config = require('./config.js')
const scenarios = require('../scenarios.js')

describe('getAuthorization', () => {
  let redirectURI = 'http://www.example.com/service?with=value'
  let authorizationReq = {
    method: 'GET',
    // TODO: there should be more parameters like grant_type, clientId etc.
    uri: `http://localhost:${config.server.port}/authorization?redirect_uri=${encodeURIComponent(redirectURI)}`,
    followRedirect: false,
    simple: false,
    resolveWithFullResponse: true
  }

  it('should redirect to loginPage with parameters when user is not authenticated', () => {
    return request(authorizationReq)
    .then((response) => {
      assert.equal(response.statusCode, 302)
      assert.equal(response.headers.location, `/login?redirect_uri=${encodeURIComponent(redirectURI)}`)
    })
  })

  it('should redirect with authorization code when user is logged in', () => {
    authorizationReq.jar = scenarios.cookieJar
    return request(authorizationReq)
    .then((response) => {
      assert.equal(response.statusCode, 302)
      let redirection = url.parse(response.headers.location, true, true)
      let redirectObj = url.parse(redirectURI, true, true)
      scenarios.authorizationCode = redirection.query.code
      assert(redirection.query.code)
      assert.equal(redirection.host, redirectObj.host)
      assert.equal(redirection.pathname, redirectObj.pathname)
    })
  })
})
