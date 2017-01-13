const jwt = require('jsonwebtoken')

function postToken (request, response) {
  let authCode = request.query.code
  this.verifyAuthCode(authCode)
  .then(() => {
    // TODO: should resolve a secret
    let token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60)}, this.config.token.secret)
    response.send(token)
  })
  .catch((error) => {
    if (error.message === 'authorization code not found') return response.sendStatus(401)
    return response.status(500).send(error.message)
  })
}

export default postToken
