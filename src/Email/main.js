var nodemailer = require('nodemailer')

function Email (config) {
  let transport = nodemailer.createTransport(config.smtps)
  let sender = config.sender

  return function sendEmailVerification (code, address) {
    let mailParameters = {
      from: sender,
      to: address,
      subject: 'Your Verification Code',
      text: `Your verification code is ${code}`,
      html: `Your verification code is <b>${code}</b>`
    }
    return new Promise((resolve, reject) => {
      transport.sendMail(mailParameters, (error, info) => {
        if (error) reject(error)
        resolve(info)
      })
    })
  }
}

module.exports = Email
