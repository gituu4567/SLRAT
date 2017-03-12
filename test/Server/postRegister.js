/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')

const config = require('../config.js')
const scenarios = require('../scenarios.js')

module.exports = function (server) {
  describe('postRegister', () => {
    let registerReq = {
      method: 'POST',
      uri: `http://localhost:${config.server.port}/register`,
      form: {},
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    }

    it('should respond 401 if contact or password is missing', () => {
      return request(registerReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Please complete all the forms')
      })
    })

    it('should respond 401 if verificationCode is missing', () => {
      registerReq.form.contact = scenarios.user.credential.contact
      registerReq.form.password = scenarios.user.credential.password

      return request(registerReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Please provide your verification code')
      })
    })

    it('should respond 401 if verificationCode is invalid', () => {
      registerReq.form.verificationCode = 'fakecode'

      return request(registerReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Your verification code is invalid')
      })
    })

    it('should respond 401 if verificationCode is valid but contact is unmatched', () => {
      registerReq.form.verificationCode = scenarios.verificationCode
      registerReq.form.contact = 'changed@email.com'

      return request(registerReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Your verification code is invalid')
      })
    })

    it('should respond 200 on successful user creation', () => {
      registerReq.form.contact = scenarios.user.credential.contact
      registerReq.form.password = scenarios.user.credential.password

      return request(registerReq)
      .then((response) => {
        assert.equal(response.statusCode, 200)
        assert.equal(response.body, 'Your account has been created')
      })
    })

    it('should not be able to reuse verification code', () => {
      return request(registerReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Your verification code is invalid')
      })
    })
  })
}
