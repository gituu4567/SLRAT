function getRoot (request, response) {
  let page = request.session.user || 'no user'
  response.send(page)
}

export default getRoot
