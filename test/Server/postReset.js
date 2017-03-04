/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
const Server = require('../../src/Server/main.js')

const config = require('./config.js')
describe('postReset', () => {
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

  let resetReq = {
    method: 'POST',
    uri: `http://localhost:${config.server.port}/reset`,
    form: {email: 'newsjianbo@163.com'},
    followRedirect: false,
    simple: false,
    resolveWithFullResponse: true
  }

  it('should respond 401 if no email is matched', () => {
    return request(resetReq)
    .then((response) => {
      assert.equal(response.statusCode, 401)
    })
  })
  it.skip('should respond 200 if resetcode is sent to email', () => {
    return server.createUser({email: 'newsjianbo@163.com', password: 'jianbo2017'})
    .then(() => {
      return server.activateUser('newsjianbo@163.com')
    })
    .then(() => {
      return request(resetReq)
    })
    .then((response) => {
      assert.equal(response.statusCode, 200)
    })
  })
})
