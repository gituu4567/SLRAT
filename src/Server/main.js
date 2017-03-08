const express = require('express')
const session = require('express-session')
const formParser = require('body-parser').urlencoded({ extended: false })
const path = require('path')

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
    this.publicDir = config.server.publicDir || path.resolve(__dirname, '../../public/')

    this.session = config.session
    this.session.resave = this.session.resave || false
    this.session.saveUninitialized = this.session.saveUninitialized || true
    this.session.cookie = this.session.cookie || { secure: true }

    this.token = config.token

    this.endPoints = express()

    this.connectDatbase = super.connect
    this.initDatabse = super.init

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

      this.endPoints.use(session(this.session))

      this.endPoints.get('/', getRoot.bind(this))
      this.endPoints.post('/login', formParser, postLogin.bind(this))
      this.endPoints.post('/register', formParser, postRegister.bind(this))
      this.endPoints.get('/activate', formParser, getActivate.bind(this))
      this.endPoints.get('/authorization', getAuthorization.bind(this))
      this.endPoints.post('/token', postToken.bind(this))
      this.endPoints.post('/newpassword', formParser, postNewPassword.bind(this))
      this.endPoints.post('/reset', formParser, postReset.bind(this))

      this.endPoints.use(express.static(this.publicDir, {extensions: ['html']}))

      return Promise.resolve(true)
    })
    .catch((error) => {
      throw new Error(error)
    })
  }

  sendActivation (address, code) {
    let mailOptions = {
      from: this.sender,
      to: address,
      subject: 'Account Activation',
      text: `please visit this address ${this.hostname}/activate?code=${code}`,
      html: `<b>please visit this address <a href=${this.hostname}/activate?code=${code}>${this.hostname}/activate?code=${code}</a></b>`
    }

    return new Promise((resolve, reject) => {
      this.transport.sendMail(mailOptions, (error, info) => {
        if (error) reject(error)
        resolve(info)
      })
    })
  }

  sendReset (address, code) {
    let mailOptions = {
      from: this.sender,
      to: address,
      subject: 'Password Reset',
      text: `please visit this address http://${this.hostname}/newpassword?code=${code}`,
      html: `<b>please visit this address <a href=${this.hostname}/newpassword?code=${code}>http://${this.hostname}/newpassword?code=${code}</a></b>`
    }

    return new Promise((resolve, reject) => {
      this.transport.sendMail(mailOptions, (error, info) => {
        if (error) reject(error)
        resolve(info)
      })
    })
  }

  start () {
    return this.init()
    .then(() => {
      console.log(`listening on port: ${this.config.port}`)
      this.endPoints.listen(this.config.port)
    })
  }
}

module.exports = Server
