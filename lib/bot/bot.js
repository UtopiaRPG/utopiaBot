var sys = require('sys')
var exec = require('child_process').exec;
var config= require("./../../config.json");

const Discord = require('discord.js');
const client = new Discord.Client();
var responses={};
var tokens = {};

if(config.rolesID.verify == null){
  console.log("need to know role to set at verify member");
  process.exit();
}

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
  var fragments= message.content.split(" ");
  if (fragments[0] === "!UB") {
    if(responses[fragments[1]]){
      responses[fragments[1]](message, fragments);
    }else{
      message.reply("commande inconnue");
    }
  }
});

exports.run=function (){
  client.login(config.token);
}

responses["token"]= function(message, fragments){
   if(tokens[message.author.username]!= null && (tokens[message.author.username].key=fragments[2]) ){
     userGuild=message.guild.member(message.author);
     userGuild.setNickname(tokens[message.author.username].nick);
     userGuild.addRole(config.rolesID.verify)//message.guild.roles.get("name",config.roles.verify).id);
     delete tokens[name];
     message.reply(" vous êtes maintenant un membre validé");
   }else{
     message.reply(" token invalide. Avez-vous fait : !UB identifie-moi-comme pseudoSurNeverUtopia");
   }
}

responses["identifie-moi-comme"]= function(message, fragments){
  token =generateToken();
  nick=message.content.substring(24)
  if(fragments[2]){
    child = exec("phantomjs --web-security=false ./lib/bot/phantomCtrl.js '"+nick+"' "+token, function (error, stdout, stderr) {
      // use this to say at user if there an error in send mp
      /*console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }*/
    });
    tokens[message.author.username]= {
      key: token,
      nick: nick
    };
    setTimeout(function(name){
      if(tokens[name])
        delete tokens[name]
      }, 1800,message.author.username);
    message.reply(" un token vient de vous être envoyer par mp sur le forum.");
  }else {
    message.reply(" un token vient de vous être envoyer par mp sur le forum.");
  }
}

function generateToken() {
    return Math.random().toString(36).substr(2);
};
