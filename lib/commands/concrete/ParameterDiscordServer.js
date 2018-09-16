module.exports = function (config, database, lang, userValidation) {

    return {
        name: 'params',
        description: 'Permet de parametrer le bot. Utilisable uniquement en mp et par les admin du server.E xemple d\'utilisation:\n' +
            '!UB params {"account_name":"Name", "account_password":"password", "link":"http://forum.com", "checked_role":"roleName"}\n' +
            'Listes des parametres:\n' +
            'account_name:\n' +
            'account_password:\n' +
            'link:\n' +
            'checked_role:',
        execute(forum, message, args) {
            if (args.length > 1 && message.guild.member(message.author).hasPermission("MANAGE_GUILD")) {
                const splited=  message.content.split(' {');
                console.log("{" + splited[1]);
                const json = JSON.parse("{" + splited[1]);
                if(json.checked_role){
                    const role = message.guild.roles.find("name", json.checked_role);
                    if(role){
                        json.checked_role = role.id;
                    }
                }
                forum.loadJSON(json);
                forum.save().then(() => {
                    message.reply("Parameters have been updated");
                });
            }
            else {
                message.reply(this.description);
            }
        }
    }
};