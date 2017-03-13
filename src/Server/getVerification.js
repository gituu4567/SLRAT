const r = require('rethinkdb')

function getVerification (request, response) {
  let action = request.query.action
  let contact = request.query.contact
  // TODO: should assert SMS number is legitimate
  let type = (/.{1,}@.{1,}/.test(contact)) ? 'Email' : 'SMS'
  if (!contact) return response.status(401).send('please specify your contact')
  if (!action) return response.status(401).send('please specify your action')
  this.whiteListed(contact)
  .then(() => {
    return r.db('SLRAT').table('users')('contact').count(contact).run(this.connection)
  })
  .then((result) => {
    if (action === 'signup' && result === 0) return Promise.resolve()
    if (action === 'signup') return Promise.reject(new Error('you have already signuped'))
    if (action === 'reset' && result === 1) return Promise.resolve()
    if (action === 'reset') return Promise.reject(new Error('you have not yet signuped'))
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
    if (error.message === 'you have already signuped') return response.status(401).send(error.message)
    if (error.message === 'you have not yet signuped') return response.status(401).send(error.message)
    if (error.message === 'contact not found in whitelist') return response.status(401).send('Sorry, you are not allowed to use our services')
    return response.status(500).send(error.message)
  })
}

module.exports = getVerification
