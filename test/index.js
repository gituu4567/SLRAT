/* eslint-env mocha */
describe('Database', () => {
  require('./Database/createTables.js')
  require('./Database/validateUser.js')
  require('./Database/authenticateUser.js')
  require('./Database/authCode.js')
})

describe.only('Server', () => {
  // require('./Server/init.js')
  // require('./Server/getRoot.js')
  require('./Server/postLogin.js')
})
