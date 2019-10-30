
module.exports = function (config, database, lang, userValidation) {

    return {
        name: 'pseudo',
        description: `commande supprimée. Lancer cette commande vous informe sur la commande de remplacement : \`link\`.`,
        aliases: ['identifie-moi-comme','ask-for-validation'],
        execute(message, args) {
            message.reply(lang.command.description.link);
        },
    }
};
