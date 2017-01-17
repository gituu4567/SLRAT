function postLogin (request, response) {
  let credential = request.body
  this.authenticate(credential)
  .then(() => {
    request.session.user = credential.email
    let redirectURI = request.query.redirect_uri
    if (redirectURI) return response.redirect(302, `/authorization?redirect_uri=${redirectURI}`)
    // NOTE: maybe unnecessary ???
    return response.redirect(302, '/')
  })
  .catch((error) => {
    if (error.message === 'credential does not match') return response.sendStatus(401)
    return response(error.message)
  })
}

export default postLogin
