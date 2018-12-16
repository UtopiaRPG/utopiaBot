const bot=require("./lib/bot.js");
const Discord = require('discord.js');
var config= require("./config.json");

const discord = new Discord.Client();
new bot(config, discord);

console.log("try connect");
discord.login(config.token).catch(function (error) {
    console.log(error || "connected");
});

