const express = require('express')
const session = require('express-session')
const formParser = require('body-parser').urlencoded({ extended: false })

const Database = require('../Database/main.js')
const getRoot = require('./getRoot.js')
const postLogin = require('./postLogin.js')
const postRegister = require('./postRegister.js')
const getActivate = require('./getActivate.js')
const getAuthorization = require('./getAuthorization.js')
const postToken = require('./postToken.js')
const postNewPassword = require('./postNewPassword.js')
const postReset = require('./postReset.js')

class Server extends Database {
  constructor (config) {
    super(config.database)
    this.config = config.server
    this.endPoint = express()
    this.server = require('http').createServer(this.endPoint)
  }

  start () {
    return new Promise((resolve, reject) => {
      this.server.listen(this.config.port, () => {
        // TODO: this is problematic
        // console.log(`server listening on port ${this.config.port}`)
        resolve(true)
      })
    })
  }

  stop () {
    return new Promise((resolve, reject) => {
      this.server.close(() => {
        resolve(true)
      })
    })
  }

  listenOnEndPoint () {
    this.endPoint.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })
    this.endPoint.use(session(this.config.session))
    return this.createTables()
    .then(() => {
      this.endPoint.get('/', getRoot.bind(this))
      this.endPoint.post('/login', formParser, postLogin.bind(this))
      this.endPoint.post('/register', formParser, postRegister.bind(this))
      this.endPoint.get('/activate', formParser, getActivate.bind(this))
      this.endPoint.get('/authorization', getAuthorization.bind(this))
      this.endPoint.post('/token', postToken.bind(this))
      this.endPoint.post('/newpassword', formParser, postNewPassword.bind(this))
      this.endPoint.post('/reset', formParser, postReset.bind(this))
    })
  }
}

module.exports = Server
