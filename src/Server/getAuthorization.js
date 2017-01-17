const base32 = require('base32')

function getAuthorization (request, response) {
  if (!request.session.user) return response.redirect(302, `/login${request._parsedUrl.search}`)
  if (request.session.user) {
    let timestamp = new Date().valueOf()
    let username = request.session.user
    let clientId = request.query.client_id
    let authCode = base32.sha1(`${timestamp}&${username}/${clientId}`)
    this.storeAuthCode(authCode)
    return response.redirect(302, `${request.query.redirect_uri}&code=${authCode}`)
  }
}

export default getAuthorization
