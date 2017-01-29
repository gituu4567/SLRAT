function postNewPassword (request, response) {
  let resetCode = request.query.code
  if (!resetCode) return response.sendStatus(401)
  this.verifyResetCode(resetCode)
  .then((email) => {
    return this.changePassword(email, request.query.password)
  })
  .then(() => {
    response.sendStatus(200)
  })
  .catch((error) => {
    console.log(error)
  })
}

export default postNewPassword
