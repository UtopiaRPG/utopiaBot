const Command = require("../lib/commands/command");

class MockCommand extends Command {

  constructor(bot){
    this.bot = this.bot;
    this.bot.commands["mock"] = function(message, fragments){
        message.reply(JSON.stringify({message: message, fragments:fragments}))
    }
  }
}

module.exports = MockCommand;
