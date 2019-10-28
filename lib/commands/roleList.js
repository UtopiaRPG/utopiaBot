const { prefix } = require('../../config.json');

module.exports = function() {
    return {
        name: "roles",
        description: "Lise de l'ensemble des commandes, ou des infos sur une commande spécifique.",
        aliases: ['commands'],
        usage: "[command name]",
        execute(message, args) {
            console.log(args[1])
            if(args[1]){
                message.author.send(message.guild.roles.find(role => role.id == args[1]).name)
            }else {
                message.author.send(message.guild.roles.reduce((response, role)=> `${response}${role.id} -> ${role.name}\n`, ""))
            }
        }
    }
}