const crypto = require('crypto')
const request = require('request-promise')

function createSMSSender (config) {
  let parameters = {
    AccessKeyId: config.accessKeyID,
    Action: 'SingleSendSms',
    ParamString: '', // JSON.stringify(config.paramString)
    RecNum: '',
    SignName: config.signName,
    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: '',
    SignatureVersion: '1.0',
    TemplateCode: config.templateCode,
    Timestamp: '',
    Version: '2016-09-27'
  }

  let accessKeySecret = config.accessKeySecret
  let uri = 'https://sms.aliyuncs.com/'

  return function sendSMSVerification (code, contact) {
    let now = new Date()
    parameters.RecNum = contact
    parameters.ParamString = JSON.stringify({code})
    parameters.SignatureNonce = crypto.randomBytes(3).toString('hex')
    parameters.Timestamp = now.toISOString()

    let signStr = []
    for (let i in parameters) {
      signStr.push(`${encodeURIComponent(i)}=${encodeURIComponent(parameters[i])}`)
    }
    signStr = signStr.join('&')
    signStr = 'POST&%2F&' + encodeURIComponent(signStr)
    const sign = crypto.createHmac('sha1', accessKeySecret + '&').update(signStr).digest('base64')
    const signature = encodeURIComponent(sign)
    let reqBody = [`Signature=${signature}`]
    for (let i in parameters) {
      reqBody.push(`${i}=${parameters[i]}`)
    }
    reqBody = reqBody.join('&')
    let sendSMSReq = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      uri: uri,
      body: reqBody,
      method: 'POST'
    }

    return request(sendSMSReq)
  }
}

module.exports = createSMSSender
