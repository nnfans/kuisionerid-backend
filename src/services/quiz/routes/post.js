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
              attributes: fastify.schema.quiz.jsonSchema()
            }
          }
        },
        required: ['data']
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
                attributes: fastify.schema.quiz.jsonSchema()
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
      const newQuiz = new fastify.model.Quiz(req.body.data.attributes)

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
