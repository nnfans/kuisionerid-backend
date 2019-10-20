module.exports = function loginHandler(deps) {
  const { bcrypt } = deps

  return {
    post: async function(req, rep) {
      const foundUser = await this.model.User.findOne(
        {
          username: req.body.username
        },
        'username password'
      )

      let isValid = false
      if (foundUser) {
        // Check if user password is match
        isValid = await bcrypt.compare(req.body.password, foundUser.password)
      }

      if (isValid) {
        const resultData = foundUser.getPublicFields()

        const token = this.jwt.sign({
          user: {
            username: req.body.username
          }
        })

        return {
          data: resultData,
          token
        }
      } else {
        rep.unauthorized('Username and password not match')
      }
    }
  }
}
