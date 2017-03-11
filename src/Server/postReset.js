const crypto = require('crypto')

function postReset (request, response) {
  let contact = request.body.contact
  let resetCode

  return this.validateContact(contact)
  .then((contact) => {
    let timestamp = Date.valueOf()
    let randomBytes = crypto.randomBytes(16).toString('hex')
    let hash = crypto.createHash('sha256')
    hash.update(`${timestamp}/${randomBytes}`)
    resetCode = hash.digest('hex')

    return this.storeResetCode(resetCode, contact)
  })
  .then(() => {
    return this.sendReset(contact, resetCode)
  })
  .then(() => {
    return response.status(200).send('An Email has been sent to you, please check.')
  })
  .catch((error) => {
    if (error.message === 'contact is not registered') return response.status(401).send('contact is not registered')
    return response.status(500).send(error.messsage)
  })
}

module.exports = postReset
