const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  console.log("message", message)
  var fragments= message.content.plit(" ");
  if (fragments[0] === "!UB") {
    message.reply("pong");
  }
});

exports.run=function(token, options){

  client.login(token);
}
