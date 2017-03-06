/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')

const config = require('./config.js')
const scenarios = require('../scenarios.js')

describe('getActivate', () => {
  it('should respond 401 when activation code is not found', () => {
    let activateReq = {
      method: 'GET',
      uri: `http://localhost:${config.server.port}/activate`,
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    }
    return request(activateReq)
    .then((response) => {
      assert.equal(response.statusCode, 401)
    })
  })

  it('should respond 200 when user is activated', () => {
    let activationCode = scenarios.activationCode
    let activateReq = {
      method: 'GET',
      uri: `http://localhost:${config.server.port}/activate?code=${activationCode}`,
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    }
    return request(activateReq)
    .then((response) => {
      assert.equal(response.statusCode, 200)
    })
  })
})
