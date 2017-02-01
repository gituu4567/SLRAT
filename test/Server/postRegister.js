/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
import Server from '../../src/Server/main.js'

import config from './config.js'
describe('postRegister', () => {
  let credential = {email: 'test@email.com', password: 'testshouldhavenone'}
  let registerReq = {
    method: 'POST',
    uri: `http://localhost:${config.server.port}/register`,
    form: credential,
    followRedirect: false,
    simple: false,
    resolveWithFullResponse: true
  }
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

  it.only('should respond 200 on successful user creation', () => {
    return request(registerReq)
    .then((response) => {
      assert.equal(response.statusCode, 200)
    })
  })

  it('should store an activation code', () => {
    return request(registerReq)
    .then((response) => {
      assert(response.statusCode, 200)
      return server.get(`SELECT * from activationcodes`)
    })
    .then((row) => {
      assert(row)
    })
    .catch((error) => {
      throw new Error(error)
    })
  })

  // TODO: should be able to omit userLimiter in config
  it('should respond 403 if email is not allowed to register', () => {
    let badRegisterReq = Object.assign({}, registerReq)
    badRegisterReq.form = {email: 'iam@bad.com', password: 'password'}
    return request(badRegisterReq)
    .then((response) => {
      assert.equal(response.statusCode, 403)
    })
  })

  it('should send an email with activation code')
})
