const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async function(fastify, opts, next) {
  // Prepare an empty schema object into instance
  fastify.decorate('schema', {})
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'schemas'),
    options: Object.assign({}, opts)
  })

  // Prepare an empty model object into instance
  fastify.decorate('model', {})
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'models'),
    options: Object.assign({}, opts)
  })

  // Register routes as plugins too, yes everything
  // is a plugin in fastify right?
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign(
      {
        prefix: '/quiz'
      },
      opts
    )
  })

  next()
}
