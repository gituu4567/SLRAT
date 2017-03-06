const express = require('express')
const session = require('express-session')
const formParser = require('body-parser').urlencoded({ extended: false })

var nodemailer = require('nodemailer')

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
    this.endPoints = express()
    // this.server = require('http').createServer(this.endPoint)
    this.connectDatbase = super.connect
    this.initDatabse = super.init
    // this.init = this.init.bind(this)
    this.transport = nodemailer.createTransport(config.mailer.transport)
    this.sender = config.mailer.sender
    this.hostname = config.mailer.hostname
  }

  init () {
    return this.connectDatbase()
    .then(() => {
      return this.initDatabse()
    })
    .then((result) => {
      this.endPoints.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        next()
      })

      this.endPoints.use(session(this.config.session))

      this.endPoints.get('/', getRoot.bind(this))
      this.endPoints.post('/login', formParser, postLogin.bind(this))
      this.endPoints.post('/register', formParser, postRegister.bind(this))
      this.endPoints.get('/activate', formParser, getActivate.bind(this))
      this.endPoints.get('/authorization', getAuthorization.bind(this))
      this.endPoints.post('/token', postToken.bind(this))
      this.endPoints.post('/newpassword', formParser, postNewPassword.bind(this))
      this.endPoints.post('/reset', formParser, postReset.bind(this))

      return Promise.resolve(true)
    })
    .catch((error) => {
      throw new Error(error)
    })
  }

  sendActivation () {
    console.log('sent reset');
  }

  sendReset () {
    console.log('sent activation');
  }
}

module.exports = Server
