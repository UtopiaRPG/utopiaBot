class command {

  constructor(bot){
    this.bot = this.bot;
  }

  _register(){
    throw new Error("Should be implemented");
  }
}

module.exports = command;
