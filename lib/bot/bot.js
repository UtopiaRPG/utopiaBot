var sys = require('sys')
var exec = require('child_process').exec;

const Discord = require('discord.js');
const client = new Discord.Client();
var responses={};
var tokens = {};

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  console.log("message", message)
  var fragments= message.content.split(" ");
  if (fragments[0] === "!UB") {
    if(responses[fragments[1]]){
      responses[fragments[1]](message, fragments);
    }else{
      message.reply("commande inconnue");
    }
  }
});

exports.run=function (config){
  client.login(config.token);
  config=config;
  if(!config.roles){
    config.roles = {verify: "Membre vérifié"};
  }
}

responses["token"]= function(message, fragments){
   if(tokens[message.author.username]!= null && (tokens[message.author.username].key=fragments[2]) ){
     userGuild=message.guild.member(message.author);
     userGuild.setNickname(tokens[message.author.username].nick);
     userGuild.addRole(message.guild.roles[config.roles.verify]);
     message.reply("@"+message.author.username+" vous êtes maintenant un membre validé");
   }else{
     message.reply("@"+message.author.username+" token invalide. Avez-vous fait : !UB identifie-moi-comme pseudoSurNeverUtopia");
   }
}

responses["identifie-moi-comme"]= function(message, fragments){
  token =generateToken();
  if(fragments[2]){
    child = exec("phantomjs ./lib/bot/phantomCtrl.js "+message.author.username+" "+token, function (error, stdout, stderr) {
      sys.print('stdout: ' + stdout);
      sys.print('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
    tokens[message.author.username]= {
      key: token,
      nick: fragments[2]
    };
    message.reply("@"+message.author.username+" un token vient de vous être envoyer par mp sur le forum.");
  }else {
    message.reply("@"+message.author.username+" un token vient de vous être envoyer par mp sur le forum.");
  }
}

function generateToken() {
    return Math.random().toString(36).substr(2); // remove `0.`
};
