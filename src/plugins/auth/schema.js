const fp = require('fastify-plugin')

module.exports = fp(function(fastify, opts, next) {
  const mongoose = fastify.mongoose
  const Schema = mongoose.base.Schema

  fastify.schema.user = new Schema({
    fullname: String,
    username: {
      type: String,
      unique: true
    },
    password: String,
    changes: [Schema.Types.Mixed],
    createdAt: {
      type: Date,
      default: Date.now
    }
  })

  fastify.schema.user.methods.getPublicFields = function() {
    const returnObject = {
      fullname: this.fullname,
      username: this.username,
      createdAt: this.createdAt
    }
    return returnObject
  }

  next()
})
