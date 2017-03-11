/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')

const config = require('../config.js')
const scenarios = require('../scenarios.js')

const r = require('rethinkdb')

module.exports = function getVerification (server) {
  describe('getVerification', () => {
    let verificationReq = {
      method: 'GET',
      uri: `http://localhost:${config.server.port}/verification`,
      qs: {},
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    }

    it('should respond 401 when contact field is missing', () => {
      return request(verificationReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'please specify your contact')
      })
      .catch((error) => {
        throw new Error(error)
      })
    })

    it('should respond 401 when action field is missing', () => {
      verificationReq.qs.contact = scenarios.user.credential.contact
      return request(verificationReq)
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'please specify your action')
      })
      .catch((error) => {
        throw new Error(error)
      })
    })

    it('should respond 200 when verify register with a new SMS contact', () => {
      verificationReq.qs.contact = '18888888888'
      verificationReq.qs.action = 'register'

      return request(verificationReq)
      .then((response) => {
        assert.equal(response.statusCode, 200)
      })
      .catch((error) => {
        throw new Error(error)
      })
    })

    it('should have sent an SMS Verification', () => {
      assert(server.sendSMSVerification.called)
    })

    it('should respond 200 when verify register with a new email contact', () => {
      verificationReq.qs.contact = scenarios.user.credential.contact

      return request(verificationReq)
      .then((response) => {
        assert.equal(response.statusCode, 200)
      })
      .catch((error) => {
        throw new Error(error)
      })
    })

    it('should have sent an Email Verification', () => {
      assert(server.sendEmailVerification.called)
      scenarios.verificationCode = server.sendEmailVerification.args[0][0]
    })

    it('should respond 401 when verify register action with a registered contact', () => {
      return server.createUser(scenarios.user.credential)
      .then(() => {
        return request(verificationReq)
      })
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'you have already registered')
      })
      .catch((error) => {
        throw new Error(error)
      })
    })

    it('should respond 200 when verify reset with a registered contact', () => {
      verificationReq.qs.action = 'reset'
      return request(verificationReq)
      .then((response) => {
        assert.equal(response.statusCode, 200)
      })
      .catch((error) => {
        throw new Error(error)
      })
    })

    it('should respond 401 when verify reset action with an un registered contact', () => {
      return r.db('SLRAT').table('users')(0).run(server.connection)
      .then((result) => {
        return r.db('SLRAT').table('users').get(result.id).delete().run(server.connection)
      })
      .then(() => {
        verificationReq.qs.action = 'reset'
        return request(verificationReq)
      })
      .then((response) => {
        assert.equal(response.statusCode, 401)
        assert.equal(response.body, 'you have not yet registered')
      })
      .catch((error) => {
        throw new Error(error)
      })
    })
  })
}
