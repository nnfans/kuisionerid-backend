const path = require('path')
const AutoLoad = require('fastify-autoload')

function initializeStaticFileProvider(instance) {
  instance.register(require('fastify-static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/public'
  })
}

function decorateFastifyInstance(instance) {
  instance.register(require('fastify-helmet'))
  initializeStaticFileProvider(instance)
}

module.exports = function(fastify, opts, next) {
  // Place here your custom code!
  decorateFastifyInstance(fastify)

  // Loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(require('./services/quiz'))

  next()
}
