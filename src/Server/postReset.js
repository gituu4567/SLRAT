const r = require('rethinkdb')

function postReset (request, response) {
  let verificationCode = request.body.verificationCode
  let contact = request.body.contact
  let password = request.body.password

  if (!contact || !password) return response.status(401).send('Please complete all the forms')
  if (!verificationCode) return response.status(401).send('Please provide your verification code')

  this.verifyCode(verificationCode)
  .then((result) => {
    if (result === contact) return Promise.resolve()
    return Promise.reject(new Error('Your verification code is invalid'))
  })
  .then(() => {
    return this.changePassword(contact, password)
  })
  .then(() => {
    return r.db('SLRAT').table('verification').get(verificationCode).delete().run(this.connection)
  })
  .then(() => {
    response.status(200).send('Your password has been changed')
  })
  .catch((error) => {
    if (error.message === 'invalid verification code') return response.status(401).send('Your verification code is invalid')
    if (error.message === 'Your verification code is invalid') return response.status(401).send(error.message)
    response.status(500).send(error.message)
  })
}

module.exports = postReset
