const express = require('express')
// const path = require('path')
const session = require('express-session')
const formParser = require('body-parser').urlencoded({ extended: false })

import Database from '../Database/main.js'
import getRoot from './getRoot.js'
import postLogin from './postLogin.js'

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
    this.endPoint.use(session(this.config.session))
    return this.createTables()
    .then(() => {
      this.endPoint.get('/', getRoot.bind(this))
      this.endPoint.post('/login', formParser, postLogin.bind(this))
    })
  }
}

// import onRegister from './lib/onRegister.js'
// import onAuthorization from './lib/onAuthorization.js'
// import onLogin from './lib/onLogin.js'
// import onToken from './lib/onToken.js'

// class Server {
//   constructor (config) {
//     this.config = config
//     this.api = express()
//     this.server = require('http').createServer(this.api)
//   }
//
//   init () {
//     // let sessionConfig = {
//     //   secret: this.sessionSecret,
//     //   resave: false,
//     //   saveUninitialized: true,
//     //   cookie: {}
//     // }
//     this.api.use(session(this.config.session))
//
//     // this.onRegister = onRegister.bind(this)
//     // this.onLogin = onLogin.bind(this)
//     // this.onAuthorization = onAuthorization.bind(this)
//     // this.onToken = onToken.bind(this)
//
//     this.api.get('/', (req, res) => {
//       let response = req.session.user || 'no user'
//       res.send(response)
//     })
//
//     // this.api.get('/login', (req, res) => {
//     //   res.sendFile(path.resolve('./node_modules/loginPage/index.html'))
//     // })
//   }
//
// }

export default Server
