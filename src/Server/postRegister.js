const crypto = require('crypto')

function postRegister (request, response) {
  let credential = request.body
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
    let activationCode = hash.digest('hex')

    return this.storeActivationCode(activationCode, credential.email)
  })
  .then(() => {
    response.sendStatus(200)
  })
  .catch((error) => {
    response(error.message)
  })
}

export default postRegister
