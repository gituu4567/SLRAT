function postLogin (request, response) {
  let credential = request.body
  this.authenticate(credential)
  .then(() => {
    request.session.user = credential.contact
    let redirectURI = request.query.redirect_uri
    if (redirectURI) return response.redirect(302, `/authorization?redirect_uri=${redirectURI}`)
    // NOTE: maybe unnecessary ???
    return response.redirect(302, '/')
  })
  .catch((error) => {
    if (error.message === 'credential does not match') return response.status(401).send('wrong contact or password')
    return response.status(500).send(error.message)
  })
}

module.exports = postLogin
