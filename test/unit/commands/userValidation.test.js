const expect = require( "chai" ).expect;
const EventEmitter = require( 'events' ).EventEmitter;
const sinon = require( 'sinon' );
const lang = require( "../../../lib/lang/fr-fr.json" )
const Command = require( "../../../lib/commands/userValidation" );


const config = {
  modules: [ '../../test/mockCommand' ],
  lang: "fr-fr",
  name: "utopiaBot",
  password: "botTest",
  rolesID: {
    verify: "282854395094499329"
  },
  forum: {
    link: "http://towndev.kanak.fr/"
  }
}

const bot = {
  config: config,
  commands: {},
  lang: lang
}


describe( "userValidation", function () {

  xdescribe( "register commands", function () {
    //need to test method called. Not to test equality
    it( "register !UB pseudo as command", () => {
      const command = new Command( bot );
      expect( bot.commands[ "pseudo" ] ).to.equals( command._askForValidation );
    } );

    it( "register !UB identifie-moi-comme as command", () => {
      const command = new Command( bot );
      expect( bot.commands[ "identifie-moi-comme" ] ).to.equals( command._askForValidation );
    } );

    it( "register !UB token as command", () => {
      const command = new Command( bot );
      expect( bot.commands[ "token" ] ).to.equals( command._checkAndValidateUser );
    } );
  } );

  describe( "_askForValidation", function () {
    it( " pseudo pseudoNeeded : fail", () => {
      const replySpy = sinon.spy( function ( message ) {} )
      const message = {
        content: "!UB pseudo",
        reply: replySpy
      };
      const command = new Command( bot );
      bot.commands[ "pseudo" ]( message, message.content.split( " " ) );
      sinon.assert.called( replySpy );
    } );


    it( " send mp !UB identifie-moi-comme ", async() => {
      const replySpy = sinon.spy( function ( message ) {} )
      const message = {
        content: "!UB identifie-moi-comme Ethan Valtena",
        reply: replySpy,
        author: {
          username: "Valtena"
        }
      };
      const command = new Command( bot );
      command.browser = {
        sendMP: () => Promise.resolve()
      }
      bot.commands[ "identifie-moi-comme" ]( message, message.content.split( " " ) );
      await new Promise( function ( resolve, reject ) {
        setTimeout( resolve, 100, 'foo' );
      } );
      expect( command.tokens[ "Valtena" ].nick ).to.deep.equal( "Ethan Valtena" );
      expect( command.tokens[ "Valtena" ].key ).to.exist;
    } );


    it( " send mp with !UB pseudo ", async() => {
      const replySpy = sinon.spy( function ( message ) {} )
      const message = {
        content: "!UB pseudo Ethan Valtena",
        reply: replySpy,
        author: {
          username: "Valtena"
        }
      };
      const command = new Command( bot );
      command.browser = {
        sendMP: () => Promise.resolve()
      }
      bot.commands[ "pseudo" ]( message, message.content.split( " " ) );
      await new Promise( function ( resolve, reject ) {
        setTimeout( resolve, 100, 'foo' );
      } );
      expect( command.tokens[ "Valtena" ].nick ).to.deep.equal( "Ethan Valtena" );
      expect( command.tokens[ "Valtena" ].key ).to.exist;
    } );
  } );

  describe( "_checkAndValidateUser", function () {
    it( " valid token ", () => {
      const replySpy = sinon.spy( function ( message ) {} );
      const member = {
        setNickname: sinon.spy( function ( newName ) {} ),
        addRole: sinon.spy( function ( roleID ) {} )
      };
      const message = {
        content: "!UB token hash",
        reply: replySpy,
        author: {
          username: "Valtena"
        },
        guild: {
          member: ( name ) => member
        }
      };
      const command = new Command( bot );
      command.tokens[ "Valtena" ] = {
        key: "hash",
        nick: "Ethan Valtena"
      }
      bot.commands[ "token" ]( message, message.content.split( " " ) );
      member.setNickname.calledWith( "Ethan Valtena" );
      member.addRole.calledWith( config.rolesID.verify );
      replySpy.calledWith( lang.validation );
    } );

    it( "not valid token : fail", () => {
      const replySpy = sinon.spy( function ( message ) {} );
      const message = {
        content: "!UB token notgoodhash",
        reply: replySpy,
        author: {
          username: "Valtena"
        }
      };
      const command = new Command( bot );
      command.tokens[ "Valtena" ] = {
        key: "hash",
        nick: "Ethan Valtena"
      }
      bot.commands[ "token" ]( message, message.content.split( " " ) );
      replySpy.calledWith( lang.invalidToken );
    } );


    it( "not valid pseudo but has good with other pseudo : fail ", () => {
      const replySpy = sinon.spy( function ( message ) {} );
      const member = {
        setNickname: sinon.spy( function ( newName ) {} ),
        addRole: sinon.spy( function ( roleID ) {} )
      };
      const message = {
        content: "!UB token notgoodhash",
        reply: replySpy,
        author: {
          username: "Nihil Scar"
        }
      };
      const command = new Command( bot );
      command.tokens[ "Valtena" ] = {
        key: "hash",
        nick: "Ethan Valtena"
      }
      bot.commands[ "token" ]( message, message.content.split( " " ) );
      replySpy.calledWith( lang.invalidToken );
    } );
  } );

} )
