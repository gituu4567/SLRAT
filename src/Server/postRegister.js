function postRegister (request, response) {
  let credential = request.body
  this.createUser(credential)
  .then(() => {
    response.redirect(200)
  })
  .catch((error) => {
    return response(error.message)
  })
}

export default postRegister
