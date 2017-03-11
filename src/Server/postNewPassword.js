function postNewPassword (request, response) {
  let resetCode = request.query.code
  if (!resetCode) return response.sendStatus(401)
  this.verifyResetCode(resetCode)
  .then((contact) => {
    return this.changePassword(contact, request.body.password)
  })
  .then(() => {
    response.status(200).send('your password has been changed')
  })
  .catch((error) => {
    response.status(500).send(error.message)
  })
}

module.exports = postNewPassword
