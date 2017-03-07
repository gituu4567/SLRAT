let config = {
  database: {
    address: 'rethinkdb'
  },
  server: {
    port: 3000,
    userLimiter: [/@email.com$/]
  },
  session: {
    secret: 'the answer is 42',
    cookie: {} // turn off secure cookie for testing
  },
  token: {
    secret: 'token is short'
  },
  mailer: {
    transport: 'smtps://username:password@smtp.server.com',
    sender: '"name" <sender@server.com>',
    hostname: 'http://service.com'
  }
}
module.exports = config
