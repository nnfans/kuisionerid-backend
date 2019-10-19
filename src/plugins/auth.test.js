require('dotenv').config()

const { build, possibleUncompletedCombination } = require('../testhelper')
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

afterAll(function() {
  // Shutdown app instance
  return app.close()
})

// Test /register endpoint without required field
describe('Register without required field', function() {
  const uncompletedNewUsers = possibleUncompletedCombination({
    fullname: 'Ali Budianto',
    username: 'Ali',
    password: 'Ali123'
  })

  // Clear user collections before starting the test
  beforeAll(function() {
    return app.model.User.collection.deleteMany({})
  })

  // Test each possible combination without required field
  test.each(uncompletedNewUsers)(
    'Return should be error (409: Bad Request) ',
    async function(newUser) {
      const res = await app.inject({
        method: 'POST',
        url: '/register',
        payload: newUser
      })

      expect(res.statusCode).toBe(400)
      expect(res.headers['content-type']).toBe(
        'application/json; charset=utf-8'
      )
    }
  )
})

// Test /register endpoint to duplicate unique field
describe('Register with duplicate unique field (409: Conflict)', function() {
  // Create new user before each test
  beforeEach(async function() {
    const newUser = new app.model.User({
      fullname: 'Ali Budianto',
      username: 'ali',
      password: await bcrypt.hash('ali123', 10)
    })

    return newUser.save()
  })

  // Clear user collection after each test
  afterEach(async function() {
    return app.model.User.collection.deleteMany({})
  })

  // Register with duplicate username field
  test('Register with duplicate username', async function() {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        fullname: 'Ali Susanto',
        username: 'ali',
        password: 'all1n0n3'
      }
    })

    expect(res.statusCode).toBe(409)
    expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
  })
})

// Register via /register endpoint with proper fields
describe('Register new user with success', function() {
  // Clear user collections before tests
  beforeAll(async function() {
    return app.model.User.collection.deleteMany({})
  })

  // Register with sample user data
  test('/register endpoint to create user', async function() {
    const newUser = {
      fullname: 'Ali Budianto',
      username: 'ali',
      password: '321ila'
    }

    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: newUser
    })

    expect(res.statusCode).toBe(201)
    expect(res.headers['content-type']).toBe('application/json; charset=utf-8')

    // Get user by fullname and username field in db
    const user = await app.model.User.findOne(
      {
        fullname: newUser.fullname,
        username: newUser.username
      },
      'fullname username'
    ).lean(true)

    // New user should be exists
    expect(!!user).toBe(true)
  })
})
