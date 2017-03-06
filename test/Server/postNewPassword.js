/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')

const config = require('./config.js')
const scenarios = require('../scenarios.js')

describe('postNewPassword', () => {
  let passwordReq = {
    method: 'POST',
    uri: `http://localhost:${config.server.port}/newpassword`,
    form: { password: 'newpassword' },
    followRedirect: false,
    simple: false,
    resolveWithFullResponse: true
  }

  it('should respond 401 when reset code is not found', () => {
    return request(passwordReq)
    .then((response) => {
      assert.equal(response.statusCode, 401)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  it('should respond 200 when reset code is verified', () => {
    let resetCode = scenarios.resetCode
    passwordReq.uri = `http://localhost:${config.server.port}/newpassword?code=${resetCode}`
    return request(passwordReq)
    .then((response) => {
      assert.equal(response.statusCode, 200)
      scenarios.user.credential.password = passwordReq.form.password
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
