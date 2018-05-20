const Discord = require( 'discord.js' );
//const fff = require('./commands/userValidation');

class Bot {
  constructor( config, client ) {
    this.config = config
    this.client = client // new Discord.Client({autoReconnect:true});
    this.commands = [];
    this.lang = require( "./lang/" + ( config.lang || "fr-fr" ) )
    this._bindCommands();
    this._onMessage();
  }

  _bindCommands() {
    this.config.modules.forEach( ( element ) => {
      const command = require( "./commands/" + element );
      new command( this );
    } )
  }

  _onMessage() {
    this.client.on( 'message', message => {
      console.log( "message.content", message.content )
      var fragments = message.content.split( " " );
      console.log( fragments )
      if ( fragments[ 0 ] === "!UB" ) {
        if ( this.commands[ fragments[ 1 ] ] ) {
          this.commands[ fragments[ 1 ] ]( message, fragments );
        } else {
          message.reply( this.lang.unknowCommand );
        }
      } else if ( fragments[ 0 ] === "!me" ) {
        beautifyMe( message, fragments );
      }
    } );
    console.log( "this.client", this.client )
  }

  _beautifyMe( message, fragments ) {
    fragments[ 0 ] = message.author.username;
    message.edit( '__**' + fragments.join( ' ' ) + '**__' );
  }

}

module.exports = Bot
