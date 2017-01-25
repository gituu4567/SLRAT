const express = require('express')
const session = require('express-session')
const formParser = require('body-parser').urlencoded({ extended: false })

import Database from '../Database/main.js'
import getRoot from './getRoot.js'
import postLogin from './postLogin.js'
import postRegister from './postRegister.js'
import getActivate from './getActivate.js'
import getAuthorization from './getAuthorization.js'
import postToken from './postToken.js'

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
    })
  }
}

export default Server
