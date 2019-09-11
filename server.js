// Read the .env file.
require('dotenv').config()

// Require the framework
const Fastify = require('fastify')

// Instantiate Fastify with some config
const app = Fastify({
  logger: process.env.ENV === 'dev' ? 'info' : false,
  pluginTimeout: 10000
})

const listeningPort = process.env.PORT || 3000

// Register application as a normal plugin.
app.register(require('./src/app.js'))

// Start listening.
app.listen(listeningPort, err => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  app.log.info(`KUISIONER.ID is started, listening at port ${listeningPort}`)
})
