/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
const jwt = require('jsonwebtoken')

const config = require('../config.js')
const scenarios = require('../scenarios.js')

describe('postToken', () => {
  let tokenReq = {
    method: 'POST',
    simple: false,
    resolveWithFullResponse: true
  }

  it('should respond 401 when when rejects', () => {
    let authCode = 'fakeauthcode'
    tokenReq.uri = `http://localhost:${config.server.port}/token?code=${authCode}`
    return request(tokenReq)
    .then((response) => {
      assert.equal(response.statusCode, 401)
    })
  })

  it('should respond 200 with jwt when resolves', () => {
    let authCode = scenarios.authorizationCode
    tokenReq.uri = `http://localhost:${config.server.port}/token?code=${authCode}`
    return request(tokenReq)
    .then((response) => {
      assert.equal(response.statusCode, 200)
      scenarios.token = response.body
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('should respond valid token with email', () => {
    let token = scenarios.token
    try {
      let decoded = jwt.verify(token, config.token.secret)
      assert.equal(decoded.email, scenarios.user.credential.email)
    } catch (error) {
      throw new Error('token is invalid')
    }
  })
})
