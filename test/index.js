/* eslint-env mocha */
describe.skip('Mailer', () => { // dont want to spam any one yet
  require('./Mailer/main.js')
})

describe('Database', () => {
  require('./Database/createTables.js')
  require('./Database/validateUser.js')
  require('./Database/activation.js')
  require('./Database/authenticateUser.js')
  require('./Database/authCode.js')
  require('./Database/resetCode.js')
})

describe('Server', () => {
  require('./Server/init.js')
  require('./Server/getRoot.js')
  require('./Server/postLogin.js')
  require('./Server/postRegister.js')
  require('./Server/getActivate.js')
  require('./Server/getAuthorization.js')
  require('./Server/postNewPassword.js')
  require('./Server/postToken.js')
  require('./Server/postReset.js')
})
