const command = require("./command");

class userValidation extends command {

  constructor(bot){
    super();
    this.tokens = {};
    this.validationMessage = ( bot.config.message || "voici le token pour Discord : \n \n !UB token {token}")
    this._register(bot);
  }

  _register(bot){
    bot.commands["pseudo"] = this.bot.commands["identifie-moi-comme"] =  this._askForValidation
    bot.commands["token"] = this._checkAndValidateUser
  }

  _askForValidation(message, fragments){
    const token = this._generateToken();
    const nick= this.validationMessage.content.substring(24);
    const content = this.validationMessage.replace( "{token}", token );
    if(fragments[2]){
      browser.sendMP(nick,lang.mp.title,content).then( () => {
          tokens[message.author.username]= {
            key: token,
            nick: nick
          };
          message.reply(lang.tokenSend);
        }
      }).catch( err => message.reply(lang.mp.sendError));
    }else {
      message.reply(lang.pseudoNeeded);
    }
  }

  _checkAndValidateUser(message, fragments){
    const name= message.author.username;
    if(tokens[name]!= null && (tokens[name].key=fragments[2]) ){
       const userGuild=message.guild.member(message.author);
       userGuild.setNickname(tokens[name].nick);
       userGuild.addRole(config.rolesID.verify)//message.guild.roles.get("name",config.roles.verify).id);
       delete tokens[name];
       message.reply(lang.validation);
     }else{
       message.reply(lang.invalidToken);
     }
  }

}

module.exports= userValidation;
