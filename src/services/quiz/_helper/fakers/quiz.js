const faker = require('faker')

const gUnique = function(generator) {
  const takenUsername = []

  const getUniqueUsername = function(lastUsername) {
    if (
      typeof lastUsername !== 'undefined' &&
      lastUsername !== '' &&
      typeof takenUsername[lastUsername] === 'undefined'
    ) {
      takenUsername.push(lastUsername)
      return lastUsername
    } else {
      if (typeof lastUsername !== 'undefined') {
        console.log(lastUsername)
      }
      return getUniqueUsername(generator())
    }
  }

  return function() {
    return getUniqueUsername()
  }
}

const quizFaker = function(nData) {
  if (typeof nData !== 'number') {
    nData = 1
  }

  if (nData < 1) {
    throw new Error('quizFaker 1st argument: nData must be 1 or more')
  }

  const uniqueUsername = gUnique(faker.internet.userName)
  const uniqueEmail = gUnique(faker.internet.email)
  const uniqueName = gUnique(faker.name.findName)

  let users = Array.apply(null, Array(nData))
  users = users.map(() => {
    return {
      email: uniqueEmail(),
      username: uniqueUsername(),
      password: faker.internet.password(),
      fullname: uniqueName(),
      gender: Math.random() > 0.5 ? 'M' : 'F',
      date_of_birth: faker.date.past(),
      address: faker.address.streetAddress(),
      photo_url: ''
    }
  })

  return users
}

module.exports = quizFaker
