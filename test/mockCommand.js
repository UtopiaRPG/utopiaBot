const Command = require("../lib/commands/command");

class MockCommand extends Command {

  constructor(bot){
    console.log("bot", bot)
    super();
    bot.commands["mock"] = function(message, fragments){
      console.log("reply")
        message.reply(JSON.stringify({message: message, fragments:fragments}))
    }
  }
}

module.exports = MockCommand;
