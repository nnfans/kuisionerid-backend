const path = require('path')

function initializeStaticFileProvider(instance) {
  instance.register(require('fastify-static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/public'
  })
}

function decorateFastifyInstance(instance) {
  instance.register(require('fastify-helmet'))
  instance.register(require('fastify-sensible'))
  instance.register(require('fastify-jwt'), { secret: process.env.JWT_SECRET })
  instance.register(require('fastify-auth'))

  instance.register(require('./plugins/db'))
  instance.register(require('./plugins/auth'))
  initializeStaticFileProvider(instance)
}

module.exports = function(fastify, opts, next) {
  // Place here your custom code!
  decorateFastifyInstance(fastify)

  fastify.register(require('./services/quiz'))

  next()
}
