// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('./app')

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {}
}

// automatically build instance
function build(instance) {
  const app = Fastify()

  if (instance === undefined) {
    // Default app.js instance
    app.register(fp(App), config())
  } else {
    // If instance argument is set
    // Load it
    app.register(fp(instance), config())
  }

  return app
}

module.exports = {
  config,
  build
}
