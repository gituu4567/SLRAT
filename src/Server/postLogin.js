function postLogin (request, response) {
  let credential = request.body
  this.authenticate(credential)
  .then(() => {
    response.send(credential.email)
  })
  .catch((error) => {
    if (error.message === 'credential does not match') return response.sendStatus(401)
  })
}

export default postLogin
