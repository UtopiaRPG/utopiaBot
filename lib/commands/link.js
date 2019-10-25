
module.exports = function (config, database, lang, userValidation) {

    return {
        name: 'link',
        description: lang.command.description.link,
        aliases: ['lie-compte', 'lie-profil','ask-for-validation'],
        execute(message, args) {
            let theMessage = message;
            if (args.length > 1) {
                userValidation.askForValidation(theMessage, args);
            }
            else {
                message.reply(lang.profilNumberNeeded);
            }
        },
    }
};
