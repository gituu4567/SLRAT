const path = require('path')

const SLRAT = require('./Server/main.js')

const config = {
  database: {
    address: 'rethinkdb'
  },
  server: {
    port: 3000
  },
  session: {
    secret: 'the answer is 42',
    cookie: {} // turn off secure cookie for testing
  },
  token: {
    secret: 'token is short'
  },
  mailer: {
    transport: 'smtps://newsjianbo:slratapp2017@smtp.163.com',
    sender: '"newsjianbo" <newsjianbo@163.com>',
    hostname: 'http://slrat.jianbo.online',
    activationTemplate: path.resolve(__dirname, '../template/activationTemplate.html'),
    resetTemplate: path.resolve(__dirname, '../template/resetTemplate.html')
  }
}

const slrat = new SLRAT(config)
slrat.start()
