
const Discord = require('discord.js');
const userValidation = require("../commands/userValidation.js")

class Bot{
  constructor(config, client){
    this.config = config
    this.client = client// new Discord.Client({autoReconnect:true});
    this.commands = [];
    this._bindCommands();
  }

  _bindCommands(){
    new userValidation(this);
  }

  _onMessage(){
    this.client.on('message', message => {
      var fragments= message.content.split(" ");
      if (fragments[0] === "!UB") {
        if(this.commands[fragments[1]]){
          this.commands[fragments[1]](message, fragments);
        }else{
          message.reply(lang.unknowCommand);
        }
      }else if(fragments[0] === "!me"){
        beautifyMe(message, fragments);
      }
    });
  }

  _beautifyMe(message, fragments){
    fragments[0] = message.author.username;
    message.edit( '__**'+fragments.join(' ')+'**__');
  }

  _bindResponses(){
    this.responses["roleID"] = this._listRolesID;
  }

  _listRolesID(message, fragments){
    let str =message.guild.roles.reduce(function(prev, el){ return  prev +"\n"+el.id+ " : "+el.name}, "")
    message.author.sendMessage(str)
  }

  _generateToken() {
      return Math.random().toString(36).substr(2);
  };

}

module.exports = bot
