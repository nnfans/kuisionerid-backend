const fp = require('fastify-plugin')
const mongoose = require('mongoose')

module.exports = fp(function(fastify, opts, next) {
  let nextCalled = false

  let uri

  if (
    typeof process.env.MONGODB_URI === 'string' &&
    process.env.MONGODB_URI !== ''
  ) {
    uri = process.env.MONGODB_URI
  } else {
    const userPass =
      process.env.MONGODB_USER && process.env.MONGODB_PASS
        ? process.env.MONGODB_USER + ':' + process.env.MONGODB_PASS + '@'
        : ''
    const host = process.env.MONGODB_HOST || 'localhost'
    const port = process.env.MONGODB_PORT || 27017
    const database = process.env.MONGODB_NAME

    uri = `mongodb://${userPass}${host}:${port}/${database}`
  }

  const conn = mongoose.createConnection(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: false
  })

  require('mongoose-schema-jsonschema')(mongoose)
  fastify.addHook('onClose', (instance, done) => {
    instance.mongoose.on('close', function() {
      done()
    })
    instance.mongoose.close()
  })

  conn.on('error', function(err) {
    fastify.log.error('(Mongoose) MongoDB: ' + err)
  })

  conn.on('connected', function() {
    fastify.log.info('(Mongoose) MongoDB: Connected')
    if (!nextCalled) {
      nextCalled = true
      next()
    }
  })

  fastify.decorate('mongoose', conn)
})
