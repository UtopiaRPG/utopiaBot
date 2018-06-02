
module.exports = function (config, database, lang, userValidation) {

    return {
        name: 'pseudo',
        description: 'Permet de demander à recevoir un token sur le forum, pour ensuite être validé.',
        aliases: ['identifie-moi-comme', 'ask-for-validation'],
        execute(message, args) {
            let theMessage = message;
            if (args.length > 1) {
                userValidation.askForValidation(theMessage, args);
            }
            else {
                message.reply(lang.pseudoNeeded);
            }
        },
    }
};
