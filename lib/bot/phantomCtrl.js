var system = require( 'system' );
var page = require( 'webpage' ).create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;//Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;

page.onConsoleMessage = function ( msg, lineNum, sourceId ) {
  console.log( 'CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")' );
};

function nextPage( callback ) {
  page.onLoadFinished = function () {
    page.onLoadFinished = function(){
    page.render('sendMP.png')
    console.log(page.cookies);
  };
    page.render('login.png')
    console.log(page.cookies);
    callback();
  };
}

function loadConfig( config ) {
  var config = require( './../../config.json' );
  return {
    name: config.name || "utopiaBot",
    password: config.password,
    link: config.forum.link,
    message: config.message || "voici le token pour Discord : \n \n !UB token {token}"
  };
}

function login() {
  page.open( bot.link + '/login', function ( status ) {
    if ( status == 'success' ) {
      console.log( "login" );
      nextPage( sendMP );
      console.log( "evaluation" );
      page.evaluate( function ( bot ) {
        function getFormByAction( action ) {
          console.log( "document", document.getElementsByTagName( "form" ).length )
          for ( var i = 0; i < document.forms.length; i++ ) {
            console.log( i, document.forms[ i ].action, action )
            if ( document.forms[ i ].action == action )
              return document.forms[ i ];
          }
          return null;
        }

        var form = getFormByAction( bot.link + '/login' );
        console.log( "form", form )
        form.elements[ "username" ].value = bot.name;
        form.elements[ "password" ].value = bot.password;
        form.submit();
        console.log( "login submitted" );
        return null;
      }, bot )
      console.log( "sended connection" )
    } else {
      console.log( "fail login" );
      phantom.exit();
    }
  } );

}

function sendMP() {
  console.log( "send mp load page", bot.link + '/privmsg?mode=post' );
  page.open( bot.link + '/privmsg?mode=post', function ( status ) {
    console.log( "send mp loaded", status, status == 'success' );
    if ( status == 'success' ) {
      console.log("bot",bot);
      res = page.evaluate( function ( bot ) {
        function getFormByAction( action ) {
          for ( var i = 0; i < document.forms.length; i++ ) {
            console.log( i, document.forms[ i ].action )
            if ( document.forms[ i ].action == action )
              return document.forms[ i ];
          }
          return null;
        }

        form = getFormByAction( bot.link + '/privmsg?mode=post' );
        if ( form == null ) {
          return "login";
        } else {
          console.log( "already connected" );
          form.elements[ "username" ].value = destinataire;
          form.elements[ "message" ].value = bot.message.replace( "{token}", token );
          form.submit();
          phantom.exit();
        }
      }, bot )
      if ( res == "login" ) {
        console.log( "need connexion" );
        login();
      }
    } else {
      console.log( "fail sendMP load" );
      phantom.exit();
    }
  } );
}

console.log( "args", system.args )

var token = system.args[ 1 ];
var destinataire = system.args[ 0 ];
var bot = loadConfig();
sendMP();
