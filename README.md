# SLRAT
<!-- **S**ign up, **L**ogin, **R**est password, obtain **A**uthorization, issue **T**oken -->

## How to install:
`npm install SLRAT`.


## How to use:
if you have an rethinkdb server up, just run
```javascript
const SLRAT = require('SLRAT')

var config = {
  database: { address: 'rethinkdb' },
  server: {
    session: {
      secret: 'session secret',
      resave: false, // should be default
      saveUninitialized: true, // should be default
      cookie: {} // should be default
    },
    token: { secret: 'token secret' }
  },
  mailer: {
    transport: 'smtps://username:password@smtp.server.com',
    sender: '"name" <sender@server.com>',
    hostname: 'http://service.com'
  }
}

const slrat = new SLRAT(config)
slrat.start()
```
else please use `docker-compose up -d`

## Overwrite options:
  * Pages
  * UserLimiter

## TODO:
  * HTTPS support
  * Authorization scope
  * Public key encryption
