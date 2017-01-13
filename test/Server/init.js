/* eslint-env mocha */
const assert = require('assert')
import Server from '../../src/Server/main.js'

describe('init', () => {
  let config = {
    database: {
      filename: ':memory:'
    }
  }
  let server
  it('should pass', () => {
    server = new Server(config)
    assert(server)
  })
})
