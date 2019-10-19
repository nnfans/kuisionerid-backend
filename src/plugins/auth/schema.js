const fp = require('fastify-plugin')

module.exports = fp(function(fastify, opts, next) {
  const mongoose = fastify.mongoose
  const Schema = mongoose.base.Schema

  const userSchema = new Schema({
    fullname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    changes: [Schema.Types.Mixed],
    createdAt: {
      type: Date,
      default: Date.now
    }
  })

  userSchema.methods.getPublicFields = function() {
    const returnObject = {
      fullname: this.fullname,
      username: this.username,
      createdAt: this.createdAt
    }
    return returnObject
  }

  userSchema.methods.isDuplicate = async function() {
    const foundDuplicate = await this.model('User')
      .findOne(
        {
          username: this.username
        },
        '_id'
      )
      .lean(true)
    return !!foundDuplicate
  }

  fastify.schema.user = userSchema

  next()
})
