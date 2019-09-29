const fp = require('fastify-plugin')
const { build } = require('../../testhelper')
const mongoose = require('mongoose')
const fastJson = require('fast-json-stringify')
let app

// Prepare service as a fastify plugin
// for test use
const service = function(fastify, opts, next) {
  // Register db plugins
  fastify.register(fp(require('../../plugins/db')))

  // Register service as a plugin
  fastify.register(fp(require('./index')), opts)

  next()
}

beforeAll(async () => {
  // add __MONGO_URI__ to process.env.MONGODB_URI
  process.env.MONGODB_URI = global.__MONGO_URI__
  app = build(service)

  return app.ready()
})

afterAll(async () => {
  // Shutdown app instance
  await app.close()
})

test('/quiz endpoint', async function() {
  // Create new quiz
  const newQuiz = new app.model.Quiz({
    name: 'Test Quiz',
    items: [
      {
        kind: 'Statement',
        title: 'First statement',
        description: 'First statement description'
      },
      {
        kind: 'Statement',
        title: 'Second statement',
        description: 'Second statement description'
      },
      {
        kind: 'Statement',
        title: 'Third statement',
        description: 'Third statement description'
      }
    ],
    isTemplate: false,
    isPublic: true,
    isDraft: false,
    createdBy: mongoose.Types.ObjectId(),
    updatedBy: mongoose.Types.ObjectId()
  })

  await newQuiz.save()

  const stringifyQuiz = fastJson({
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: app.schema.quiz.jsonSchema()
      },
      meta: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          count: { type: 'number' }
        }
      },
      links: {
        type: 'object',
        properties: {
          self: { type: 'string' },
          first: { type: 'string' },
          last: { type: 'string' },
          prev: { type: 'string' },
          next: { type: 'string' }
        }
      }
    }
  })

  const res = await app.inject({
    method: 'GET',
    url: '/quiz/public'
  })

  const expectStatusCode = expect(res.statusCode).toBe(200)
  const expectContentType = expect(res.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  )
  const expectPayload = expect(res.payload).toEqual(
    stringifyQuiz({
      data: [newQuiz]
    })
  )

  return Promise.all([expectStatusCode, expectContentType, expectPayload])
})
