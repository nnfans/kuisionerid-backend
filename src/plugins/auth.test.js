require('dotenv').config()

const { build } = require('../testhelper')
const bcrypt = require('bcryptjs')

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

  await app.ready()

  return app.model.User.createIndexes()
})

afterAll(async function() {
  // Shutdown app instance
  await app.close()
})

beforeEach(async function() {
  // Reset database
  await app.model.User.collection.deleteMany({})
})

describe('Register without required field should error (400: Bad Request)', function() {
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

  test('Register without username only', async function() {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        fullname: 'Ali Budianto',
        password: 'Ali123'
      }
    })

    expect(res.statusCode).toBe(400)
  })

  test('Register without password only', async function() {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        fullname: 'Ali Budianto',
        username: 'ali'
      }
    })

    expect(res.statusCode).toBe(400)
  })
})

describe('Register with duplicate unique field (409: Conflict)', function() {
  beforeEach(async function() {
    const newUser = new app.model.User({
      fullname: 'Ali Budianto',
      username: 'ali',
      password: await bcrypt.hash('ali123', 10)
    })

    return newUser.save()
  })

  afterEach(async function() {
    await app.model.User.collection.deleteMany({})
  })

  test('Register with duplicate username', async function() {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        fullname: 'Ali Budianto',
        username: 'ali',
        password: 'ali123'
      }
    })

    expect(res.statusCode).toBe(409)
  })
})
