const r = require('rethinkdb')

const EventEmitter = require('events')
const events = new EventEmitter()

function RandomNumbers (length) {
  let number = ''
  for (let i = 0; i < length; i += 1) {
    number += Math.floor(Math.random() * 10).toString()
  }

  return number
}

function generateVerificationCode (contact) {
  return new Promise((resolve, reject) => {
    let generateAndInsert = () => {
      let code = RandomNumbers(6)

      r.db('SLRAT').table('verification').get(code).run(this.connection)
      .then((doc) => {
        if (doc) return events.emit('generateAndInsert')
        return r.db('SLRAT').table('verification').insert({id: code, contact}).run(this.connection)
      })
      .then(() => {
        events.removeAllListeners('generateAndInsert')
        resolve(code)
      })
      .catch((error) => {
        reject(error)
      })
    }

    events.on('generateAndInsert', generateAndInsert)
    events.emit('generateAndInsert')
  })
}

function verifyCode (code) {
  return r.db('SLRAT').table('verification').get(code).run(this.connection)
  .then((doc) => {
    if (!doc) return Promise.reject(new Error('invalid verification code'))
    return Promise.resolve(doc.contact)
  })
}

module.exports = { generateVerificationCode, verifyCode }
