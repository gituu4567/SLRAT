function getActivate (request, response) {
  let activationCode = request.query.code
  if (!activationCode) return response.sendStatus(401)
  this.verifyActivation(activationCode)
  .then((email) => {
    return this.activateUser(email)
  })
  .then(() => {
    response.status(200).send('you are activated')
  })
}

export default getActivate
