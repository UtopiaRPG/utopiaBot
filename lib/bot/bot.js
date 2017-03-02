const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  fragments= message.content.plit(" ");
  !UB
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

exports.run=function(token, options){

  client.login(token);
}
