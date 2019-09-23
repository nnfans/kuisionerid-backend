const fp = require('fastify-plugin')

module.exports = fp(function(fastify, opts, next) {
  const mongoose = fastify.mongoose
  const Schema = mongoose.base.Schema

  fastify.schema.item = new Schema(
    {
      title: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    },
    { discriminatorKey: 'kind' }
  )

  fastify.schema.quiz = new Schema({
    name: String,
    items: [fastify.schema.item],
    isTemplate: Boolean,
    isPublic: Boolean,
    isDraft: Boolean,
    createdBy: Schema.Types.ObjectId,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: Schema.Types.ObjectId,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  })

  fastify.schema.quiz.path('items').discriminator(
    'Statement',
    new Schema({
      description: String
    })
  )

  fastify.schema.quiz.path('items').discriminator(
    'Choice',
    new Schema({
      description: String,
      choices: [String],
      isMultiSelect: Boolean
    })
  )

  fastify.schema.quiz.path('items').discriminator(
    'Scale',
    new Schema({
      description: String,
      from: Number,
      to: Number
    })
  )

  next()
})
