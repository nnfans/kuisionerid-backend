const fp = require('fastify-plugin')
const { BadRequest } = require('http-errors')

module.exports = fp(function(fastify, opts, next) {
  /** Prepare an empty objects into instance */
  if (fastify.model === undefined) {
    fastify.decorate('model', {})
  }

  fastify.register(require('./auth/model'))

  /** Verify JWT & Add request.user variable */
  async function userFromJWT(request, reply) {
    request.user = {}
    try {
      const data = await request.jwtVerify()
      if (data === undefined) {
        throw new BadRequest("Token doesn't have any data")
      }

      request.user = data.user
    } catch (err) {
      request.err.auth = err
    }
  }

  /** Extend request.user info from jwt */
  async function extendUserInfo(request, reply) {
    if (request.user.username === undefined) {
      return undefined
    }

    request.user = await this.model.User.find(
      {
        username: request.user.username
      },
      'fullname username createdAt'
    )
  }

  fastify.decorate('userFromJWT', userFromJWT)
  fastify.decorate('extendUserInfo', extendUserInfo)

  fastify.register(require('./auth/routes'))

  next()
})
