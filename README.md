# SLRAT
**SLRAT** is a server that implements five endpoints:
* _/**s**ignup_
* _/**l**ogin_
* _/**r**eset_
* _/**a**uthorization_
* _/**t**oken_

It is a standalone server that creates users account, authenticates them and issues access token for third party service.

A typical use case will be, you want to build a file server that only allows registered user to download. You can first deploy your SLRAT server, which users can create their account, change passwords and login. On the file server, you verify user's requests' using [JSON web token].

You can also use this as a starting point for any service that also provide OAuth 2.0 (partially implemented).

## How To Install:
`npm install SLRAT`.

## How To Use:
SLRAT uses rethinkdb as backend. If you use docker (the preferred method), The database itself is not exposed, making it more secure, as described in it's [documentation].

For starting the server, create your main file and have your configuration ready. then run ```slrat.start()```.

```javascript
const SLRAT = require('SLRAT')
const config = {
  database: {
    address: 'rethinkdb'
  },
  server: {
    port: 80
  },
  session: {
    secret: 'the answer is 42',
  },
  token: {
    secret: 'used to sign'
  },
  Email: {
    smtps: 'smtps://username:password@smtp.domain.com',
    sender: '"name" <address@domain.com>'
  },
  SMS: {
    accessKeyID: 'key',
    accessKeySecret: 'secret',
    signName: 'sign name',
    templateCode: 'template code'
  }
}
const slrat = new SLRAT(config)
slrat.start()
```

By containerize your slrat application, your can use a docker-compose file to quickly set it up like this.

```yml
version: '2.1'
services:
  SLRAT:
    image: YourSLRAT
    ports:
      - 80:80
    links:
      - database:rethinkdb
    command: [npm, start]
  database:
    image: 'rethinkdb:latest'
    expose:
      - 28015/tcp
      - 29015/tcp
      - 8080/tcp
    volumes:
      - /host/persistent:/data
---
```

## Overwrite The Default:

### Verification Methods
SLRAT uses email and sms for sending verification code. by default email is sent using [nodemailer] package, and sms is sent using _aliyun_ service api.

You can overwrite these functions:
```javascript
SLRAT.prototype.sendEmailVerification(code, email) {
  return new Promise(function(resolve, reject) {
    // your method of sending email
    if (error) reject(error)
    if (success) resolve(true)
  });
}
SLRAT.prototype.sendSMSVerification(code, number) {
  return new Promise(function(resolve, reject) {
    // your method of sending sms
    if (error) reject(error)
    if (success) resolve(true)
  });
})
```
### Pages
SLRAT provides 3 minimal html pages for signup, login and reset password. You can also use your own pages with branding, introduction etc. In order to serve these custom pages, you need to config it like this:
```javascript
const config = {
  // ...
  server: {
    // ...
    publicDir: '/path/to/your/pages/'
  }
  //...
}
```

### Whitelist
By default, your SLRAT allows anyone to signup. In some cases you want to allow only certain people to use your service, therefore you can set whitelist flag like this:
```javascript
const config = {
  // ...
  whitelist: true
  //...
}
```
Afeter this, you will have to manually insert ```{contact:'iam@allowed.com'}``` or ```{contact:'18888888888'}``` into whitelist table to enable them to signup.

## TODO:
  * Comply with OAuth 2.0
  * Public key encryption

[JSON web token]:(https://jwt.io)
[documentation]:(https://hub.docker.com/_/rethinkdb/)
[nodemailer]:(https://github.com/nodemailer/nodemailer)
