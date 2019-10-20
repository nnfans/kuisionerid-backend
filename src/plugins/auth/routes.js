const fp = require('fastify-plugin')
const bcrypt = require('bcryptjs')

module.exports = fp(function(fastify, opts, next) {
  const registerHandler = require('./register')({
    User: fastify.model.User,
    httpErrors: fastify.httpErrors,
    jwt: fastify.jwt
  })
  const loginHandler = require('./login')({ bcrypt })

  /** Register route */
  fastify.route({
    url: '/register',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          fullname: { type: 'string' },
          username: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['fullname', 'username', 'password']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                fullname: { type: 'string' },
                username: { type: 'string' },
                createdAt: { type: 'string' }
              }
            },
            token: { type: 'string' }
          }
        }
      }
    },
    handler: registerHandler.post
  })

  /** Login route */
  fastify.route({
    url: '/login',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['username', 'password']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: fastify.model.User.schema.jsonSchema(),
            token: { type: 'string' }
          }
        },
        401: {
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: loginHandler.post
  })

  next()
})
