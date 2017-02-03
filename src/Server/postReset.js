const crypto = require('crypto')
import Mailer from '../Mailer/main.js'

function postReset (request, response) {
  let email = request.body.email
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
    return response.status(200).send('reset link has been sent to your email')
  })
  .catch((error) => {
    if (error.message === 'email is not found') return response.status(401).send('email is not registered')
    return response.status(500).send(error.messsage)
  })
}

export default postReset
