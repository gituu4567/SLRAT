/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')

const config = require('../config.js')
const scenarios = require('../scenarios.js')

module.exports = function (server) {
  describe('postSignup', () => {
    let signupReq = {
      method: 'POST',
      uri: `http://localhost:${config.server.port}/signup`,
      form: {},
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    }

    it('should respond 401 if contact or password is missing', () => {
      return request(signupReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Please complete all the forms')
      })
    })

    it('should respond 401 if verificationCode is missing', () => {
      signupReq.form.contact = scenarios.user.credential.contact
      signupReq.form.password = scenarios.user.credential.password

      return request(signupReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Please provide your verification code')
      })
    })

    it('should respond 401 if verificationCode is invalid', () => {
      signupReq.form.verificationCode = 'fakecode'

      return request(signupReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Your verification code is invalid')
      })
    })

    it('should respond 401 if verificationCode is valid but contact is unmatched', () => {
      signupReq.form.verificationCode = scenarios.verificationCode
      signupReq.form.contact = 'changed@email.com'

      return request(signupReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Your verification code is invalid')
      })
    })

    it('should respond 200 on successful user creation', () => {
      signupReq.form.contact = scenarios.user.credential.contact
      signupReq.form.password = scenarios.user.credential.password

      return request(signupReq)
      .then((response) => {
        assert.equal(response.statusCode, 200)
        assert.equal(response.body, 'Your account has been created')
      })
    })

    it('should not be able to reuse verification code', () => {
      return request(signupReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'Your verification code is invalid')
      })
    })
  })
}
