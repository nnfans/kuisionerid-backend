const fp = require('fastify-plugin')

module.exports = fp(function(fastify, opts, next) {
  const { mongoose, schema } = fastify
  const Quiz = mongoose.model('Quiz', schema.quiz)

  fastify.model.Quiz = Quiz

  next()
})
