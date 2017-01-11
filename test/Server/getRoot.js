/* eslint-env mocha */
const assert = require('assert')
const request = require('request-promise')
import Server from '../../src/Server/main.js'

describe('getRoot', () => {
  let config = {
    database: {
      filename: ':memory:'
    },
    server: {
      port: 3000,
      session: {
        secret: 'the answer is 42',
        resave: false,
        saveUninitialized: true,
        cookie: {}
      }
    }
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

  it('should respond "no user" when user is not logged in', () => {
    let rootReq = {
      method: 'GET',
      uri: `http://localhost:${config.server.port}/`
    }
    return request(rootReq)
    .then((response) => {
      assert.equal(response, 'no user')
    })
  })
})
