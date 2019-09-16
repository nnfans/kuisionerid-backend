const schema = require('./schema')
const model = require('mongoose').model

const Quiz = model('Quiz', schema.quizSchema)

const itemArray = schema.quizSchema.path('items')

const StatementItem = itemArray.discriminator(
  'StatementItem',
  schema.statementItemSchema
)

const ChoicesItem = itemArray.discriminator(
  'ChoicesItem',
  schema.choicesItemSchema
)

const ScaleItem = itemArray.discriminator('ScaleItem', schema.scaleItemSchema)

module.exports = { Quiz, StatementItem, ChoicesItem, ScaleItem }
module.exports.autoload = false
