const fp = require('fastify-plugin')

module.exports = fp(function(fastify, opts, next) {
  const { mongoose, schema } = fastify
  const User = mongoose.model('User', schema.user)

  fastify.model.User = User

  next()
})
