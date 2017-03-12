/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
// const Server = require('../../src/Server/main.js')

const config = require('../config.js')
const scenarios = require('../scenarios.js')

describe('getRoot', () => {
  let rootReq = {
    method: 'GET',
    uri: `http://localhost:${config.server.port}/`
  }

  it('should respond "no user" when user is not logged in', () => {
    return request(rootReq)
    .then((response) => {
      assert.equal(response, 'you are not logged in')
    })
  })

  it('should respond user information when user is logged in', () => {
    let cookieJar = request.jar()
    let loginReq = {
      method: 'POST',
      uri: `http://localhost:${config.server.port}/login`,
      form: {
        contact: scenarios.user.credential.contact,
        password: scenarios.user.credential.newPassword
      },
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true,
      jar: cookieJar
    }
    return request(loginReq)
    .then(() => {
      rootReq.jar = cookieJar
      return request(rootReq)
    })
    .then((response) => {
      assert.equal(response, `you are logged in as ${scenarios.user.credential.contact}`)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
