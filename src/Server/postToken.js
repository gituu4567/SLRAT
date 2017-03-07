const jwt = require('jsonwebtoken')

function postToken (request, response) {
  let authCode = request.query.code
  this.verifyAuthCode(authCode)
  .then((email) => {
    // TODO: should resolve a secret
    let token = jwt.sign({email: email, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, this.token.secret)
    response.send(token)
  })
  .catch((error) => {
    if (error.message === 'authorization code not found') return response.status(401).send('authorization code is not found')
    return response.status(500).send(error.message)
  })
}

module.exports = postToken
