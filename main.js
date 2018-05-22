const bot=require("./lib/bot.js");
const Discord = require('discord.js');
var config= require("./config.json");

const discord = new Discord.Client({autoReconnect:true});
discord.login(config.token);

new bot(config, discord);
