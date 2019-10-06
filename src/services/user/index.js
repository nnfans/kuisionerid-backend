const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async function(fastify, opts, next) {
  // Register routes as plugins too, yes everything
  // is a plugin in fastify right?
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign(
      {
        prefix: '/user'
      },
      opts
    )
  })

  next()
}
