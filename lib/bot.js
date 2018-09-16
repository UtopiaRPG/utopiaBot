const Discord = require('discord.js');
const fs = require('fs');
const Database = require('./utilities/database.js');
const UserValidation = require('./userValidation/userValidation.js');
const Forum = require("./data/model/Forum");

class Bot {
    constructor(config, client) {
        this.config = config;
        this.client = client;
        client.commands = new Discord.Collection();
        this.database = new Database(config.clientDatabase, config.hostDatabase, config.passwordDatabase, config.database);
        this.lang = require("./lang/" + (config.lang || "fr-fr"));
        this._onReady();
        this._onMessage();
        this._connection();
        this.userValidation = new UserValidation(this);

        const commandFiles = fs.readdirSync('./lib/commands/concrete');
        for (const file of commandFiles) {
            const command = require(`./commands/concrete/${file}`)(config, this.database, this.lang, this.userValidation);
            client.commands.set(command.name, command);
        }
    }

    _onReady() {
        this.client.on('ready', () => {
            console.log('I am ready!');
        });

        if(this.reconnect){
            clearTimeout(this.reconnect);
        }
    }

    _onMessage() {
        this.client.on('message', message => {

            if (!message.content.startsWith(this.config.prefix) || message.author.bot) {
                return;
            } else {
                this._computeMessage(message);
            }
        });
    }

    _computeMessage(message){
        const args = message.content.slice(this.config.prefix.length).split( " " );
        const commandName = args[0].toLowerCase();

        const command = this.client.commands.get(commandName) ||
            this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        try {
            if(command.private){
                command.execute(message, args);
            } else {
                if (message.guild){
                    console.log(message.guild.id, "find this id")
                    Forum.findById(message.guild.id).then( forum =>
                        command.execute(forum, message, args)
                    );
                } else {
                    message.reply('these command must be send on discord server');
                }
            }
        }
        catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }

    _onGuildEvent(){
        this.client.on("guildCreate",(guild)=> {
            Forum.create(message.guild.id,{})
        })

        this.client.on("guildDelete",(guild)=> {
            Forum.findById(message.guild.id).then( forum =>
                forum.destroy()
            );
        })
    }

    _connection(){
        this.client.on("disconnect",()=> {
            this.reconnect();
        })
    }

    reconnect(){
        this.reconnect = setTimeout(() => {this.client.login(this.config.token).catch(function (error) {
            console.log(error);
            this.reconnect()
        })}, 60000)
    }
}

module.exports = Bot
