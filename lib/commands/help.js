const { prefix } = require('../../config.json');

module.exports = function() {
    return {
        name: "help",
        description: "Lise de l'ensemble des commandes, ou des infos sur une commande spécifique.",
        aliases: ['commands'],
        usage: "[command name]",
        execute(forum, message, args) {

            const {commands} = message.client;
            const data = [];

            if (args.length == 1){
                data.push("Voici la liste des commandes :");
                data.push(commands.map(command => command.name).join(", "));
                data.push(`\nVous pouvez utiliser \`${prefix}help [command name]\` pour obtenir des informations sur une commande spécifique.`);
            }
            else{
                if (!commands.has(args[1])) {
                    return message.reply("Commande invalide.");
                }

                const command = commands.get(args[1]);

                data.push(`**Nom :** ${command.name}`);

                if (command.description) data.push(`**Description:** ${command.description}`);
                if (command.aliases) data.push(`**Alias :** ${command.aliases.join(', ')}`);
                if (command.usage) data.push(`**Utilisation :** ${prefix}${command.name} ${command.usage}`);

                data.push(`**Délai :** ${command.cooldown || 3} seconde(s)`);
            }

            message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type !=='dm'){
                        message.channel.send("La liste des commandes vous a été envoyée en message privé.");
                    }
                })
                .catch(() => message.reply("Il semblerait que je ne puisse pas vous envoyer de message privé !"));

        }
    }
}