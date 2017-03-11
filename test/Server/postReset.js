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

    it('should respond 401 if no contact is matched', () => {
      resetReq.form = { contact: 'wrong@email.com' }
      return request(resetReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
      })
    })

    it('should respond 200 on successful reset request', () => {
      resetReq.form = { contact: scenarios.user.credential.contact }
      return request(resetReq)
      .then((response) => {
        assert.equal(response.statusCode, 200)
      })
    })

    it('should have sent an reset code to contact', () => {
      let lastCallArgs = server.sendReset.args[0]
      assert.equal(lastCallArgs[0], scenarios.user.credential.contact)
      assert(lastCallArgs[1])
      scenarios.resetCode = lastCallArgs[1]
    })
  })
}
