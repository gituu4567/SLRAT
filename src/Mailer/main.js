var nodemailer = require('nodemailer')

class Mailer {
  constructor (smtps, sender, hostname) {
    this.transport = nodemailer.createTransport(smtps)
    this.sender = sender
    this.hostname = hostname
  }

  sendActivation (address, code) {
    let mailOptions = {
      from: this.sender,
      to: address,
      subject: 'Account Activation',
      text: `please visit this address ${this.hostname}/activate?code=${code}`,
      html: `<b>please visit this address <a href=${this.hostname}/activate?code=${code}>${this.hostname}/activate?code=${code}</a></b>`
    }
    return new Promise((resolve, reject) => {
      this.transport.sendMail(mailOptions, (error, info) => {
        if (error) reject(error)
        resolve(info)
      })
    })
  }

  sendReset (address, code) {
    let mailOptions = {
      from: this.sender,
      to: address,
      subject: 'Password Reset',
      text: `please visit this address http://${this.hostname}/newpassword?code=${code}`,
      html: `<b>please visit this address <a href=${this.hostname}/newpassword?code=${code}>http://${this.hostname}/newpassword?code=${code}</a></b>`
    }

    return new Promise((resolve, reject) => {
      this.transport.sendMail(mailOptions, (error, info) => {
        if (error) reject(error)
        resolve(info)
      })
    })
  }
}

export default Mailer
