const crypto = require('crypto')

function postRegister (request, response) {
  let credential = request.body
  this.createUser(credential)
  .then(() => {
    let timestamp = Date.valueOf()
    let randomBytes = crypto.randomBytes(16).toString('hex')
    let hash = crypto.createHash('sha256')
    hash.update(`${timestamp}/${randomBytes}`)
    let activationCode = hash.digest('hex')

    return this.storeActivationCode(activationCode)
  })
  .then(() => {
    response.redirect(200)
  })
  .catch((error) => {
    return response(error.message)
  })
}

export default postRegister
