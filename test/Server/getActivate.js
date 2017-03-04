/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
const Server = require('../../src/Server/main.js')

const config = require('./config.js')

describe('getActivate', () => {
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

  it('should respond 401 when activation code is not found', () => {
    let activateReq = {
      method: 'GET',
      uri: `http://localhost:3000/activate`,
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
    let activationCode = 'thiswillactiveyouraccount'
    let credential = {email: 'test@example.com', password: 'password'}
    return server.createUser(credential)
    .then(() => {
      return server.storeActivationCode(activationCode, credential.email)
    })
    .then((user) => {
      let activateReq = {
        method: 'GET',
        uri: `http://localhost:3000/activate?code=${activationCode}`,
        followRedirect: false,
        simple: false,
        resolveWithFullResponse: true
      }
      return request(activateReq)
    })
    .then((response) => {
      assert.equal(response.statusCode, 200)
      // NOTE: make sure the user is activated, over testing
      return server.authenticate(credential)
    })
    .then((email) => {
      assert.equal(email, credential.email)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })
})
