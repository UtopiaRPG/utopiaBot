const Discord = require('discord.js');
const fs = require('fs');
const Database = require('./utilities/database.js');
const UserValidation = require('./userValidation/userValidation.js');


class Bot {
    constructor(config, client) {
        this.config = config;
        this.client = client;
        client.commands = new Discord.Collection();
        //this.database = new Database(config.clientDatabase, config.hostDatabase, config.passwordDatabase, config.database);
        const commandFiles = fs.readdirSync('./lib/commands');
        this.lang = require("./lang/" + (config.lang || "fr-fr"));
        this._onReady();
        this._onMessage();
        this.userValidation = new UserValidation(this);

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`)(config, this.database, this.lang, this.userValidation);
            client.commands.set(command.name, command);
        }
    }

    _onReady() {
        this.client.on('ready', () => {
            console.log('I am ready!');
        });
    }

    _onMessage() {
        this.client.on('message', message => {

            if (!message.content.startsWith(this.config.prefix) || message.author.bot) return;

            const args = message.content.slice(this.config.prefix.length).split( " " );
            const commandName = args[0].toLowerCase();

            const command = this.client.commands.get(commandName) || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) return;

            try {
                command.execute(message, args);
            }
            catch (error) {
                console.error(error);
                message.reply('there was an error trying to execute that command!');
            }


        });
        //console.log("this.client", this.client)
    }

    on(event, callback){
        console.log()
        this.client.on(event,callback)
    }

}

module.exports = Bot
