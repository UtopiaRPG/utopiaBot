
module.exports = function (config, database, lang, userValidation) {

    return {
        name: 'pseudo',
        description: `Donnez votre numero de profil (aller sur votre profil et copier le numéro ??? dans l'url : http://forum.com/u???). `,
        aliases: ['identifie-moi-comme', 'ask-for-validation'],
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
