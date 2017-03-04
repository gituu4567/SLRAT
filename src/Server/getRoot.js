function getRoot (request, response) {
  let user = request.session.user
  if (user) return response.status(200).send(`you are logged in as ${user}`)
  return response.status(200).send(`you are not logged in`)
}

module.exports = getRoot
