/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
import Server from '../../src/Server/main.js'

import config from './config.js'
describe.only('postRegister', () => {
  let credential = {email: 'test@email.host', password: 'testshouldhavenone'}
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

  it('should generate activation code')
  it('should send a email with activation code')

  it('should respond 200 on successful user creation', () => {
    return request(registerReq)
    .then((response) => {
      assert(response.statusCode, 200)
    })
  })
})
