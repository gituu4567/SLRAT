const r = require('rethinkdb')

function getVerification (request, response) {
  let action = request.query.action
  let contact = request.query.contact
  // TODO: you know what to do
  let type = (/.{1,}@.{1,}/.test(contact)) ? 'Email' : 'SMS'
  if (!contact) return response.status(401).send('please specify your contact')
  if (!action) return response.status(401).send('please specify your action')
  r.db('SLRAT').table('users')('contact').count(contact).run(this.connection)
  .then((result) => {
    if (action === 'register' && result === 0) return Promise.resolve()
    if (action === 'register') return Promise.reject(new Error('you have already registered'))
    if (action === 'reset' && result === 1) return Promise.resolve()
    if (action === 'reset') return Promise.reject(new Error('you have not yet registered'))
    return Promise.reject(new Error('unclear action'))
  })
  .then(() => {
    return this.generateVerificationCode(contact)
  })
  .then((code) => {
    let verificationType = `send${type}Verification`
    return this[verificationType](code, contact)
  })
  .then((result) => {
    return response.status(200).send('verification code sent')
  })
  .catch((error) => {
    if (error.message === 'you have already registered') return response.status(401).send(error.message)
    if (error.message === 'you have not yet registered') return response.status(401).send(error.message)
    return response.status(500).send(error.message)
  })
}

module.exports = getVerification
