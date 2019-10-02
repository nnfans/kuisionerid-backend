const mongoose = require('mongoose')
const faker = require('faker')
const quizItemFaker = require('./quizItem')

const quizFaker = function(nData, options) {
  if (typeof nData !== 'number') {
    nData = 1
  }

  if (typeof options !== 'object') {
    options = {}
  }

  let quizes = Array.apply(null, Array(nData))
  const nItems = typeof options.totalItem === 'number' ? options.totalItem : 3

  let by
  let dateTime

  quizes = quizes.map(function() {
    by = mongoose.Types.ObjectId()
    dateTime = faker.date.past()

    return {
      name: faker.lorem.sentence(3, 2),
      items: quizItemFaker(nItems, options.items),
      isTemplate: false,
      isPublic: false,
      isDraft: true,
      createdBy: by,
      createdAt: dateTime,
      updatedBy: by,
      updatedAt: dateTime
    }
  })

  if (quizes.length === 1) {
    return quizes[0]
  } else {
    return quizes
  }
}

module.exports = quizFaker
