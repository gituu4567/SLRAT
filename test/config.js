let config = {
  whitelist: true,
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
  }
  // NOTE: stubbed using sinon:
  // Email:{},
  // SMS:{}
}
module.exports = config
