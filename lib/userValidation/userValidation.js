const ChromeCtrl = require("caretaker").ChromeCtrl;
const Utilities = require("../utilities/utilities.js");

class userValidation {

    constructor(bot) {
        this.bot = bot;
        this.tokens = {};
        this.validationMessage = (bot.lang.message || "voici le token pour Discord : \n \n !UB token {token}")
        this.browser = new ChromeCtrl(bot.config);
    }

    askForValidation(forum, message, args) {
        message.reply("traitement de la demande de token en cours...");
        const token = Utilities.generateToken();
        const nick = args.slice(1,args.length).join(" ");
        const content = this.validationMessage.replace("{token}", token);
        console.log("bot ask for validation",nick);
        this.browser.isLogged(forum.data).then( async boolean =>{
            if(!boolean){
                console.log("login",forum.data)
                await this.browser.login(forum.data);
            }
            console.log("already log",forum.data)
            this.browser.sendMP(forum.data,nick, this.bot.lang.mp.title, content).then(() => {
                this.tokens[message.author.username] = {
                    key: token,
                    nick: nick
                };
                message.reply(this.bot.lang.tokenSend);
            })
        }).catch(err => {
          console.log("send MP error ",err);
          message.reply(this.bot.lang.mp.sendError);
        });
    }

    checkAndValidateUser(forum, message, args) {
        const name = message.author.username;
        if (this.tokens[name] != null && (this.tokens[name].key == args[1])) {
            const userGuild = message.guild.member(message.author);
            userGuild.addRole(forum.data.checked_role);
            userGuild.setNickname(this.tokens[name].nick)
            delete this.tokens[name];
            message.reply(this.bot.lang.validation);
        } else {
            message.reply(this.bot.lang.invalidToken);
        }
    }

}

module.exports = userValidation;
