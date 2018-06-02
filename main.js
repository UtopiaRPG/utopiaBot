const bot=require("./lib/bot.js");
const Discord = require('discord.js');
var config= require("./config.json");

const discord = new Discord.Client();
discord.login(config.token).catch(function (error) {
    console.log(error);
});

new bot(config, discord);
