/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
import Server from '../../src/Server/main.js'

import config from './config.js'
describe('postNewPassword', () => {
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

  it('should respond 401 when reset code is not found', () => {
    let passwordReq = {
      method: 'POST',
      uri: `http://localhost:${config.server.port}/newpassword`,
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    }
    return request(passwordReq)
    .then((response) => {
      assert.equal(response.statusCode, 401)
    })
  })

  it('should respond 200 when reset code is verified', () => {
    let code = 'takethiscode'
    let email = 'test@email.com'
    return server.storeResetCode(code, email)
    .then((result) => {
      let passwordReq = {
        method: 'POST',
        uri: `http://localhost:${config.server.port}/newpassword?code=${code}`,
        followRedirect: false,
        simple: false,
        resolveWithFullResponse: true
      }
      return request(passwordReq)
      .then((response) => {
        assert.equal(response.statusCode, 200)
      })
    })
  })
})
