/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
import Server from '../../src/Server/main.js'

import config from './config.js'

describe.only('postToken', () => {
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

  let authCode = 'IamGivingYouOneShot'

  let tokenReq = {
    method: 'POST',
    uri: `http://localhost:${config.server.port}/token?code=${authCode}`,
    simple: false,
    resolveWithFullResponse: true
  }

  it('should respond 401 when when rejects', () => {
    return request(tokenReq)
    .then((response) => {
      assert.equal(response.statusCode, 401)
    })
  })
  it('should respond 200 with jwt when resolves', () => {
    return server.storeAuthCode(authCode)
    .then(() => {
      return request(tokenReq)
    })
    .then((response) => {
      assert.equal(response.statusCode, 200)
      assert(response.body)
    })
  })
})
