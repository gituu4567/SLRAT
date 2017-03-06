/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')

const config = require('./config.js')
const scenarios = require('../scenarios.js')

describe('postLogin', () => {
  let loginReq = {
    method: 'POST',
    uri: `http://localhost:${config.server.port}/login`,
    followRedirect: false,
    simple: false,
    resolveWithFullResponse: true,
    jar: request.jar()
  }

  it('should respond 401 when credential does not match', () => {
    loginReq.form = {email: 'iam@bad.com', password: 'ineednone'}

    return request(loginReq)
    .then((response) => {
      assert.equal(response.statusCode, 401)
    })
  })

  it('should redirect to / when credential is authenticated', () => {
    loginReq.form = scenarios.user.credential

    return request(loginReq)
    .then((response) => {
      scenarios.cookieJar = loginReq.jar
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
    return request(loginReq)
    .then((response) => {
      assert.equal(response.statusCode, 302)
      assert.equal(response.headers.location, `/authorization?redirect_uri=${clientRedirect}`)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
