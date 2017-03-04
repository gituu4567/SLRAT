const crypto = require('crypto')
const url = require('url')

function getAuthorization (request, response) {
  if (!request.session.user) return response.redirect(302, `/login${request._parsedUrl.search}`)
  if (request.session.user) {
    let timestamp = new Date().valueOf()
    let randomBytes = crypto.randomBytes(16).toString('hex')
    let hash = crypto.createHash('sha256')
    hash.update(`${timestamp}/${randomBytes}`)
    let authCode = hash.digest('hex')
    this.storeAuthCode(authCode, request.session.user)
    let redirection = url.parse(request.query.redirect_uri, true)
    delete redirection.search
    redirection.query.code = authCode
    let redirectURI = url.format(redirection)
    return response.redirect(302, url.format(redirectURI))
  }
}

module.exports = getAuthorization
