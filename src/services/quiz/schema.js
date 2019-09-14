const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema(
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
  { discriminatorKey: 'typeOf' }
)

const statementItemSchema = new Schema({
  description: String
})

const choicesItemSchema = new Schema({
  description: String,
  choices: [String],
  isMultiSelect: Boolean
})

const scaleItemSchema = new Schema({
  description: String,
  from: Number,
  to: Number
})

const quizSchema = new Schema({
  name: String,
  items: [itemSchema],
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

module.exports = {
  quizSchema,
  statementItemSchema,
  choicesItemSchema,
  scaleItemSchema
}
