module.exports = function(deps) {
  const { User, httpErrors, jwt } = deps

  return {
    post: async function(req, rep) {
      const newUser = User(req.body)

      // Check if any of unique user field is duplicate
      if (await newUser.isDuplicate()) {
        throw httpErrors.conflict()
      }

      // Save collection to db
      await newUser.save()

      // Set HTTP Response code to 201: Created
      rep.code(201)

      const resultData = newUser.getPublicFields()

      // Signing the token then return it to client
      const token = jwt.sign({
        user: {
          username: req.body.username
        }
      })

      return {
        data: resultData,
        token
      }
    }
  }
}
