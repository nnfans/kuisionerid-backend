const fp = require('fastify-plugin')
const bcrypt = require('bcryptjs')

module.exports = fp(function(fastify, opts, next) {
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
            data: fastify.schema.user.jsonSchema(),
            token: { type: 'string' }
          }
        }
      }
    },
    handler: async function(req, rep) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
      const newUser = this.model.User(req.body)

      await newUser.save()

      const resultData = newUser.getPublicFields()

      const token = fastify.jwt.sign({
        user: {
          username: req.body.username
        }
      })

      return {
        data: resultData,
        token
      }
    }
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
            data: fastify.schema.user.jsonSchema(),
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
    handler: async function(req, rep) {
      const foundUser = await this.model.User.findOne(
        {
          username: req.body.username
        },
        'username password'
      )

      let isValid = false
      if (foundUser) {
        // Check if user password is match
        isValid = await bcrypt.compare(req.body.password, foundUser.password)
      }

      if (isValid) {
        const resultData = foundUser.getPublicFields()

        const token = fastify.jwt.sign({
          user: {
            username: req.body.username
          }
        })

        return {
          data: resultData,
          token
        }
      } else {
        rep.unauthorized('Username and password not match')
      }
    }
  })

  next()
})
