const t = require('tap')
const fp = require('fastify-plugin')
const { build, loadMongoTestServer } = require('../../testhelper')
const mongoose = require('mongoose')
const fastJson = require('fast-json-stringify')

// Prepare service as a fastify plugin
// for test use
const service = function(fastify, opts, next) {
  // Register db plugins
  fastify.register(fp(require('../../plugins/db')))

  // Register service as a plugin
  fastify.register(fp(require('./index')), opts)

  next()
}

t.plan(1)
t.test('Testing quiz endpoint', async t => {
  // Load & Run mongodb test server
  const mongoserver = await loadMongoTestServer()

  const app = build(t, service, function() {
    mongoserver.stop()
  })

  await app.ready()

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

  t.plan(1)

  t.test('GET: /quiz/public endpoint', async t => {
    const res = await app.inject({
      method: 'GET',
      url: '/quiz/public'
    })

    t.plan(3)

    t.strictEqual(res.statusCode, 200)
    t.strictEqual(
      res.headers['content-type'],
      'application/json; charset=utf-8'
    )
    t.deepEqual(
      res.payload,
      stringifyQuiz({
        data: [newQuiz]
      })
    )
  })
})
