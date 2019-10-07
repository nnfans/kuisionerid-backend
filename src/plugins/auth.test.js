require('dotenv').config()

const { build } = require('../testhelper')

let app

// Prepare service as a fastify plugin
// for test use
const service = function(fastify, opts, next) {
  // Register db plugins
  fastify.register(require('fastify-helmet'))
  fastify.register(require('fastify-sensible'))
  fastify.register(require('fastify-jwt'), { secret: process.env.JWT_SECRET })
  fastify.register(require('fastify-auth'))

  fastify.register(require('./db'))
  fastify.register(require('./auth'))

  next()
}

beforeAll(async function() {
  // add __MONGO_URI__ to process.env.MONGODB_URI
  process.env.MONGODB_URI = global.__MONGO_URI__
  app = build(service)

  return app.ready()
})

afterAll(async function() {
  // Shutdown app instance
  await app.close()
})

describe('Register without required field should error should be (402)', function() {
  test('Register without fullname only', async function() {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        username: 'Ali',
        password: 'Ali123'
      }
    })

    expect(res.statusCode).toBe(400)
  })
})
