const crypto = require('crypto')
import Mailer from '../Mailer/main.js'

function postReset (request, response) {
  let email = request.email
  let mailer = new Mailer(this.config.transport, this.config.sender, this.config.hostname)
  let resetCode

  return this.validateEmail(email)
  .then((email) => {
    let timestamp = Date.valueOf()
    let randomBytes = crypto.randomBytes(16).toString('hex')
    let hash = crypto.createHash('sha256')
    hash.update(`${timestamp}/${randomBytes}`)
    resetCode = hash.digest('hex')

    return this.storeResetCode(resetCode, email)
  })
  .then(() => {
    return mailer.sendReset(email, resetCode)
  })
  .then(() => {
    response.sendStatus(200)
  })
  .catch((error) => {
    response.sendStatus(error)
  })
}

export default postReset
