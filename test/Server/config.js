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
    },
    token: {
      secret: 'token is short'
    }
  }
}

export default config
