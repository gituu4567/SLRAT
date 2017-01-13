function postLogin (request, response) {
  let credential = request.body
  this.authenticate(credential)
  .then(() => {
    response.redirect(302, '/')
  })
  .catch((error) => {
    if (error.message === 'credential does not match') return response.sendStatus(401)
    return response(error.message)
  })
}

export default postLogin
