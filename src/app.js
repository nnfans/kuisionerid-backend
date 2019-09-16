const path = require('path')
const AutoLoad = require('fastify-autoload')

function initializeStaticFileProvider(fastify) {
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/public'
  })
}

function decorateFastifyInstance(instance) {
  initializeStaticFileProvider(instance)
}

module.exports = function(fastify, opts, next) {
  // Place here your custom code!
  decorateFastifyInstance(fastify)

  fastify.register(require('fastify-helmet'))

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })

  // Make sure to call next when done
  next()
}
