const Utilities = require("../utilities/utilities.js")
const HttpController = require("../httpController")

class userValidation {

  constructor(bot) {
    this.bot = bot
    this.tokens = {}
    this.browser = new HttpController(bot.config)
    this.listen()
  }

  listen(){
    this.bot.on("userUpdate",(old,user)=>{
      console.log("userUpdate", old.username,"to", user.username)
      if(old.username === user.username){
        this.bot.client.guilds.forEach((guild, key) => {
          guild.members.forEach(member => {
            if (member.id == user.id && !member.nickname) {
              member.setNickname(old.username)
            }
          })
        })
      }
    })
  }

  askForValidation(message, args) {
    const token = Utilities.generateToken()
    const profile = args[1]
    console.log("bot ask for validation", args)
    this.tokens[message.author.username] = {
      member: message.member,
      token,
      profile
    }
    message.reply(`token : \`${token}\`
         ${this.bot.lang.tokenSend}`)

  }

  checkAndValidateUser(message, args) {
    const name = message.author.username
    console.log(name, this.tokens)
    if (this.tokens[name] != null) {
      let user = this.tokens[name]
      this.browser.loadProfile(user.profile).then(body => {
        if (body.indexOf(this.tokens[name].token) != -1) {
          const userGuild = this.tokens[name].member
          let pseudo = body.match(/href="\/spa\/[^"]*/)[0].split("/")[2]
          console.log("setting pseudo :", pseudo)
          Promise.all([
            userGuild.setNickname("updatingPseudo"),
            userGuild.addRole(this.bot.config.rolesID.verify) //message.guild.roles.get("name",config.roles.verify).id);
          ]).then(() => {
            delete this.tokens[name]
            message.reply(this.bot.lang.validation)
          }).catch(e =>{
            console.error(e)
              message.reply(this.bot.lang.errorDuringValidation)
          })
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
