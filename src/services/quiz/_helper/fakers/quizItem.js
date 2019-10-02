const faker = require('faker')

const quizItemKind = ['Statement', 'Choice', 'Scale']

const decorateQuizItem = function(data) {
  switch (data.kind) {
    case 'Statement':
      data.description = faker.lorem.sentence(12, 4)
      break

    case 'Choice':
      data.description = faker.lorem.sentence(4, 2)
      data.choices = Array.apply(undefined, Array(4)).map(() =>
        faker.lorem.sentence(2)
      )
      data.isMultiSelect = Math.random() > 0.5
      break

    case 'Scale':
      data.description = faker.lorem.sentence(4, 2)
      data.from = 0
      data.to = faker.random.number({ min: 5, max: 10 })
      break
  }

  return data
}

const quizItemFaker = function(nData, options) {
  if (typeof nData !== 'number') {
    nData = 1
  }

  if (typeof options !== 'object') {
    options = {}
  }

  const { onlyKind } = options
  let isOnlyKind = false

  let quizItems = Array.apply(null, Array(nData))

  let dateTime
  let kind

  if (typeof onlyKind === 'string' && quizItemKind.includes(onlyKind)) {
    isOnlyKind = true
    kind = onlyKind
  }

  quizItems = quizItems
    .map(function() {
      dateTime = faker.date.past()
      if (!isOnlyKind) {
        kind =
          quizItemKind[
            faker.random.number({ min: 0, max: quizItemKind.length - 1 })
          ]
      }

      return {
        title: faker.lorem.sentence(3, 2),
        kind: kind,
        createdAt: dateTime,
        updatedAt: dateTime
      }
    })
    .map(decorateQuizItem)

  return quizItems
}

module.exports = quizItemFaker
