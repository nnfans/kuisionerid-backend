const fp = require('fastify-plugin')
const mongoose = require('mongoose')

module.exports = fp(function(fastify, opts, next) {
  const userPass =
    process.env.DB_USER && process.env.DB_PASS
      ? process.env.DB_USER + ':' + process.env.DB_PASS + '@'
      : ''
  const host = process.env.DB_HOST || 'localhost'
  const port = process.env.DB_PORT || 27017
  const database = process.env.DB_NAME

  mongoose.connect(`mongodb://${userPass}${host}:${port}/${database}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: false
  })
  require('mongoose-schema-jsonschema')(mongoose)

  mongoose.connection.on('error', function(err) {
    fastify.log.info('Error database connection: ' + err)
  })

  next()
})
