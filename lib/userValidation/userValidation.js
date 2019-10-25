const Utilities = require("../utilities/utilities.js")
const HttpController = require("../httpController")

class userValidation {

  constructor(bot) {
    this.bot = bot
    this.tokens = {}
    this.validationMessage = (bot.lang.message || "voici le token pour Discord : \n \n !UB token {token}")
    this.browser = new HttpController(bot.config)
  }

  askForValidation(message, args) {
    const token = Utilities.generateToken()
    const profile = args[1]
    console.log("bot ask for validation", args)
    this.tokens[message.author.username] = {
      token,
      profile
    }
    message.reply(`token : ${token}
         ${this.bot.lang.tokenSend}`)

  }

  checkAndValidateUser(message, args) {
    const name = message.author.username
    console.log(name, this.tokens)
    if (this.tokens[name] != null) {
      let user = this.tokens[name]
      this.browser.loadProfile(user.profile).then(body => {
        if (body.indexOf(this.tokens[name].token) != -1) {
          const userGuild = message.guild.member(message.author)
          Promise.all([
            userGuild.setNickname(body.match(/href="\/spa\/[^"]*/)[0].split("/")[2]),
            userGuild.addRole(this.bot.config.rolesID.verify) //message.guild.roles.get("name",config.roles.verify).id);
          ]).then(() => {
            delete this.tokens[name]
            message.reply(this.bot.lang.validation)
          }).catch(
            message.reply(this.bot.lang.errorDuringValidation)
          )
        } else {
          message.reply(this.bot.lang.invalidToken)
        }
      })
    } else {
      message.reply(this.bot.lang.invalidToken)
    }
  }

}

module.exports = userValidation
