const command = require( "./command" );

class ListRoles extends command {

  constructor( bot ) {
    super();
    this.tokens = {};
    this.validationMessage = ( bot.config.message || "voici le token pour Discord : \n \n !UB token {token}" )
    this._register( bot );
  }

  _register( bot ) {
    bot.commands["roleID"] = this._listRolesID;
  }


  _listRolesID( message, fragments ) {
    let str = message.guild.roles.reduce( function ( prev, el ) {
      return prev + "\n" + el.id + " : " + el.name
    }, "" )
    message.author.sendMessage( str )
  }

}

module.exports = ListRoles;
