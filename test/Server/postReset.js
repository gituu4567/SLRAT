/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')

const config = require('../config.js')
const scenarios = require('../scenarios.js')

module.exports = function (server) {
  describe('postReset', () => {
    let resetReq = {
      method: 'POST',
      uri: `http://localhost:${config.server.port}/reset`,
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    }
    it('should respond 401 if contact or password is missing', () => {
      return request(resetReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Please complete all the forms')
      })
    })

    it('should respond 401 if verificationCode is missing', () => {
      resetReq.form = {
        contact: scenarios.user.credential.contact,
        password: scenarios.user.credential.password
      }

      return request(resetReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Please provide your verification code')
      })
    })

    it('should respond 401 if verificationCode is invalid', () => {
      resetReq.form.verificationCode = 'fakecode'

      return request(resetReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Your verification code is invalid')
      })
    })

    it('should respond 401 if verificationCode is valid but contact is unmatched', () => {
      resetReq.form.contact = 'iam@bad.com'

      return server.generateVerificationCode(scenarios.user.credential.contact)
      .then((code) => {
        resetReq.form.verificationCode = code
        return request(resetReq)
      })
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Your verification code is invalid')
      })
    })

    it('should respond 200 on successful password reset', () => {
      resetReq.form.contact = scenarios.user.credential.contact
      resetReq.form.password = 'newpassword'
      scenarios.user.credential.newPassword = 'newpassword'

      return request(resetReq)
      .then((response) => {
        assert.equal(response.statusCode, 200)
        assert.equal(response.body, 'Your password has been changed')
      })
    })

    it('should not be able to reuse verification code', () => {
      return request(resetReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Your verification code is invalid')
      })
    })
  })
}
