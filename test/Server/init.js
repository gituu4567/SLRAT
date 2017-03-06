/* eslint-env mocha */
const assert = require('assert')
const Server = require('../../src/Server/main.js')

const config = require('./config.js')

describe.only('init', () => {
  let server
  it('should pass', () => {
    server = new Server(config)
    return server.init()
    .then((result) => {
      assert(result)
      assert(server.connection)
    })
  })
})
