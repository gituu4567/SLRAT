const crypto = require('crypto')
import Mailer from '../Mailer/main.js'

function postRegister (request, response) {
  let mailer = new Mailer(this.config.transport, this.config.sender, this.config.hostname)
  let credential = request.body
  let activationCode
  let userLimiter = this.config.userLimiter || [/.{1,}/]
  let allowed = userLimiter.some((re) => {
    return re.test(credential.email)
  })
  if (!allowed) return response.sendStatus(403)
  this.createUser(credential)
  .then(() => {
    let timestamp = Date.valueOf()
    let randomBytes = crypto.randomBytes(16).toString('hex')
    let hash = crypto.createHash('sha256')
    hash.update(`${timestamp}/${randomBytes}`)
    activationCode = hash.digest('hex')

    return this.storeActivationCode(activationCode, credential.email)
  })
  .then(() => {
    return mailer.sendActivation(credential.email, activationCode)
  })
  .then(() => {
    response.status(200).send('activation link has been sent to your email')
  })
  .catch((error) => {
    response.status(500).send(error.message)
  })
}

export default postRegister
