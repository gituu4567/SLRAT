/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')

const config = require('./config.js')
const scenarios = require('../scenarios.js')

module.exports = function (server) {
  describe('postRegister', () => {
    let credential = scenarios.user.credential
    let registerReq = {
      method: 'POST',
      uri: `http://localhost:${config.server.port}/register`,
      form: credential,
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    }

    // TODO: should be able to omit userLimiter in config
    it('should respond 403 if email is not allowed to register', () => {
      let badRegisterReq = Object.assign({}, registerReq)
      badRegisterReq.form = {email: 'iam@bad.com', password: 'password'}
      return request(badRegisterReq)
      .then((response) => {
        assert.equal(response.statusCode, 403)
      })
    })

    it('should respond 200 on successful user creation', () => {
      return request(registerReq)
      .then((response) => {
        assert.equal(response.statusCode, 200)
      })
      .catch((error) => {
        throw new Error(error)
      })
    })

    it('should have sent an activation code to email', () => {
      let lastCallArgs = server.sendActivation.args[0]
      scenarios.activationCode = lastCallArgs[1]
      assert.equal(lastCallArgs[0], credential.email)
      assert(lastCallArgs[1])
    })
  })
}
