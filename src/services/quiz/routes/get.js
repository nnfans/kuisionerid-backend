module.exports = function(fastify, opts, next) {
  fastify.route({
    url: '/',
    method: 'GET',
    schema: {
      query: {
        type: 'object',
        properties: {
          sort: { type: 'string' },
          'page[offset]': { type: 'number' },
          'page[limit]': { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: fastify.schema.quiz.jsonSchema()
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
        }
      }
    },
    handler: async function(req, rep) {
      const publicQuiz = await fastify.model.Quiz.find()

      return {
        data: publicQuiz,
        meta: {},
        links: {}
      }
    }
  })

  next()
}
