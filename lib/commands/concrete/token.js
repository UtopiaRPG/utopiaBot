module.exports = function (config, database, lang, userValidation) {

    return {
        name: 'token',
        description: 'Permet de vérifier le token et de devenir un membre validé.',
        execute(forum, message, args) {
            if (args.length > 1) {
                message.reply(message.content);
                userValidation.checkAndValidateUser(forum, message, args);
            }
            else {
                message.reply(lang.tokenNeeded);
            }
        },
    }
};