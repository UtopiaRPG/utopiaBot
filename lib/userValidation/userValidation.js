const ChromeCtrl = require("caretaker").ChromeCtrl;
const Utilities = require("../utilities/utilities.js");

class userValidation {

    constructor(bot) {
        this.bot = bot;
        this.tokens = {};
        this.validationMessage = (bot.lang.message || "voici le token pour Discord : \n \n !UB token {token}")
        new ChromeCtrl(bot.config).then(chrome => {
            this.browser = chrome;
            return chrome.login();
        });
    }

    askForValidation(message, args) {
        const token = Utilities.generateToken();
        const nick = args[1];
        const content = this.validationMessage.replace("{token}", token);
        this.browser.sendMP(nick, this.bot.lang.mp.title, content).then(() => {
            this.tokens[message.author.username] = {
                key: token,
                nick: nick
            };
            message.reply(this.bot.lang.tokenSend);
        }).catch(err => message.reply(this.bot.lang.mp.sendError));
    }

    checkAndValidateUser(message, args) {
        const name = message.author.username;
        if (this.tokens[name] != null && (this.tokens[name].key == args[1])) {
            const userGuild = message.guild.member(message.author);
            userGuild.setNickname(this.tokens[name].nick);
            userGuild.addRole(this.bot.config.rolesID.verify) //message.guild.roles.get("name",config.roles.verify).id);
            delete this.tokens[name];
            message.reply(this.bot.lang.validation);
        } else {
            message.reply(this.bot.lang.invalidToken);
        }
    }

}

module.exports = userValidation;