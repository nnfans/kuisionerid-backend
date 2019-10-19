// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('./app')

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {}
}

// automatically build instance
function build(instance) {
  const app = Fastify({ logger: { level: 'warn' } })

  if (instance === undefined) {
    // Default app.js instance
    app.register(fp(App), config())
  } else {
    // If instance argument is set
    // Load it
    app.register(fp(instance), config())
  }

  return app
}

// Generate all possible object property existance combination
function allPossibleObjPropCombination(obj) {
  if (typeof obj !== 'object') {
    throw new Error('First argument must be type of object')
  }

  const objKeys = Object.keys(obj)

  if (objKeys.length >= 2) {
    // New object without the first one key value
    const objWithoutFirst = objKeys
      .filter((_, ix) => ix !== 0)
      .reduce((acc, curr) => ({ ...acc, [curr]: obj[curr] }), {})

    // Generate all possibility of objWithoutFirst
    const resWithoutFirst = allPossibleObjPropCombination(objWithoutFirst)

    // Copy of allPossibilityWithoutFirst with added props
    const resWithFirst = resWithoutFirst.map(possibleObj => ({
      ...possibleObj,
      [objKeys[0]]: obj[objKeys[0]]
    }))

    // Return new array
    return [].concat(resWithFirst, resWithoutFirst)
  } else {
    // If only single prop inside object return two possible combination
    return [obj, {}]
  }
}

function possibleUncompletedCombination(originalObject) {
  return allPossibleObjPropCombination(originalObject).filter(
    (_, ix) => ix !== 0
  )
}

module.exports = {
  config,
  build,
  allPossibleObjPropCombination,
  possibleUncompletedCombination
}
