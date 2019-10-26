module.exports = function (config, database, lang, userValidation) {

  return {
    name: 'validate',
    description: 'Permet de vérifier le token sur le profil du forum et de devenir un membre validé.',
    execute(message, args) {
      userValidation.checkAndValidateUser(message, args)
    }
  }
}