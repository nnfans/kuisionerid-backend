// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('./app')
const { MongoMemoryServer } = require('mongodb-memory-server')

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {}
}

// automatically build and tear down our instance
function build(t, instance, tearDown) {
  const app = Fastify()

  if (instance === undefined) {
    // Default app.js instance
    app.register(fp(App), config())
  } else {
    // If instance argument is set
    // Load it
    app.register(fp(instance), config())
  }

  // tear down our app after we are done
  t.tearDown(async function() {
    if (typeof tearDown === 'function') {
      await tearDown()
    }
    await app.close()
  })

  return app
}

// run mongodb test server and
// replace the environment
async function loadMongoTestServer() {
  const mongod = new MongoMemoryServer()

  const uri = await mongod.getConnectionString()
  process.env.MONGODB_URI = uri
  return mongod
}

module.exports = {
  config,
  build,
  loadMongoTestServer
}
