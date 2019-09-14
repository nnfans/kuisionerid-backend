const schema = require('./schema')
const model = require('./model')

module.exports = function(fastify, opts, next) {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              attributes: schema.quizSchema.jsonSchema()
            }
          }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                id: { type: 'string' },
                attributes: schema.quizSchema.jsonSchema()
              }
            },
            links: {
              type: 'object',
              properties: {
                self: { type: 'string' }
              }
            }
          }
        }
      }
    },
    handler: async function(req, rep) {
      const newQuiz = new model.Quiz(req.body.data.attributes)

      return {
        data: {
          type: 'quiz',
          id: newQuiz.id,
          attributes: newQuiz
        }
      }
    }
  })

  next()
}

module.exports.autoPrefix = '/quiz'
