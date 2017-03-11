function getActivate (request, response) {
  let activationCode = request.query.code
  if (!activationCode) return response.sendStatus(401)
  this.verifyActivation(activationCode)
  .then((contact) => {
    return this.activateUser(contact)
  })
  .then(() => {
    return response.status(200).send('you are activated')
  })
  .catch((error) => {
    return response.status(500).send(error.message)
  })
}

module.exports = getActivate
