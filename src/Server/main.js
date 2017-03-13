const express = require('express')
const session = require('express-session')
const formParser = require('body-parser').urlencoded({ extended: false })
const path = require('path')

const Email = require('../Email/main.js')
const SMS = require('../SMS/main.js')

const Database = require('../Database/main.js')
const getVerification = require('./getVerification.js')
const getRoot = require('./getRoot.js')
const postLogin = require('./postLogin.js')
const postSignup = require('./postSignup.js')
const getAuthorization = require('./getAuthorization.js')
const postToken = require('./postToken.js')
const postReset = require('./postReset.js')

class Server extends Database {
  constructor (config) {
    super(config.database, config.whitelist)

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

    this.sendEmailVerification = (config.Email) ? Email(config.Email) : config.sendEmailVerification
    this.sendSMSVerification = (config.SMS) ? SMS(config.SMS) : config.sendSMSVerification
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
      this.endPoints.get('/verification', getVerification.bind(this))
      this.endPoints.post('/signup', formParser, postSignup.bind(this))
      this.endPoints.post('/login', formParser, postLogin.bind(this))
      this.endPoints.get('/authorization', getAuthorization.bind(this))
      this.endPoints.post('/token', postToken.bind(this))
      this.endPoints.post('/reset', formParser, postReset.bind(this))

      this.endPoints.use(express.static(this.publicDir, {extensions: ['html']}))

      return Promise.resolve(true)
    })
    .catch((error) => {
      throw new Error(error)
    })
  }

  sendEmailVerification (code, contact) {
    let mailOptions = {
      from: this.sender,
      to: contact,
      subject: 'Your Verification Code',
      text: `This is your verification code ${code}`,
      html: `This is your verification code <b>${code}</b>`
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
