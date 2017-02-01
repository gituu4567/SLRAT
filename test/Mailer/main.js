/* eslint-env mocha */
const assert = require('assert')
import Mailer from '../../src/Mailer/main.js'

describe('send mail', () => {
  it('should work', () => {
    let transport = 'smtps://user:password@smtp.server.com'
    let sender = '"sender" <account@server.com>'
    let hostname = 'http://slrat.host.name'

    let to = 'test@example.com'
    let code = 'justtakeit'
    let mailer = new Mailer(transport, sender, hostname)
    return mailer.sendActivation(to, code)
    .then((info) => {
      assert(info.response)
    })
  })
})
