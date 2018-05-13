// var system = require( 'system' );
// var page = require( 'webpage' ).create();
// page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
// page.settings.javascriptEnabled = true;
// page.settings.loadImages = false;//Script is much faster with this field set to false
// phantom.cookiesEnabled = true;
// phantom.javascriptEnabled = true;


var puppeteer = require( "puppeteer" )

class ChromeCtrl {
  constructor( config ) {
    this.loadConfig( config );
    return puppeteer.launch( {
      args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    } ).then( b => {
      this.browser = b;
      return this
    } );
  }

  /*public api*/

  loadConfig( config ) {
    this.config = {
      name: config.name || "utopiaBot",
      password: config.password,
      link: config.forum.link,
      message: config.message || "voici le token pour Discord : \n \n !UB token {token}",
      subject: config.messageTitle || "Token Discord"
    };
  }

  login() {
    return this.browser.newPage().then( page => {
      return this._goTo( page, '/login' ).then( response => {
        if ( response.ok() ) {
          return this._log( page, 'login' ).then( page => {
            return this._fillForm( page, '/login', {
              username: this.config.name,
              password: this.config.password
            } ).then( form => {
              return form.$x( '//*[@name="login"]' ).then( elements => {

                return new Promise( function ( resolve, reject ) {
                  let p = page.waitForSelector( "#logout" ).then( resolve )
                  elements[ 0 ].click();
                } ).then( () => page );
              } )
            } )
          } ).then( page => {
            return this._log( page, "connectedMaybe" )
          } ).catch( err => {
            console.log( "at submit  " );
            console.log( err )
          } );
        } else {
          throw new Error( "fail login" )
        }
      } )
    } )
  }

  listMP() {
    return this.browser.newPage().then( page => {
      return this._goTo( page, '/privmsg?folder=inbox' ).then( response => {
        return page.$x( '//*[@class="box-content"]//td[.//*[@class="topictitle"]]' ).then( elements => {
          return Promise.all( elements.map( tdElement =>
            tdElement.$x( '//*[@class="topictitle"]' ).then( elements => {
              return elements[0].getProperty( 'innerHTML' ).then( handle => {
                return handle.jsonValue().then( value =>{
                  return {
                    name: value
                  }
                })
              } )
            } )
          ) );
        } )
      } )
    } )

  }

  /*private*/

  _fillForm( page, action, params ) {
    let promise = page.waitForXPath( '//*[@action="' + action + '"]' )
    for ( let prop in params ) {
      promise = this._fillformChainPromise( promise, page, prop, params[ prop ] );
    }

    return promise.then( form => {
      return this._log( page, "loginfill" ).then( page => form )
    } );
  }

  _fillformChainPromise( promise, page, prop, val ) {
    return promise.then( form => {
      console.log( "fill prop form", prop, "with ", val )
      return form.$x( '//*[@name="' + prop + '"]' ).then( elements => {
        elements[ 0 ].focus();
        return page.keyboard.type( val ).then( () => {
          return form;
        } )
      } );
    } )
  }

  _log( page, namePath ) {
    return page.screenshot( {
      path: namePath + ".png",
      fullPage: true
    } ).then( () => page );
  }

  _goTo( page, uri ) {
    return page.goto( this.config.link + uri )
  }
}
//
// var fs = require('fs');
// var CookieJar = "cookiejar.json";
// if(fs.isFile(CookieJar))
//     Array.prototype.forEach.call(JSON.parse(fs.read(CookieJar)), function(x){
//         phantom.addCookie(x);
//     });
//
// function nextPage( callback ) {
//   page.onUrlChanged = function ( targetUrl ) {
//     console.log( 'New URL: ' + targetUrl );
//
//     page.onLoadFinished = function () {
//       page.onLoadFinished = function () {
//         page.render( 'sendMP.png' )
//         console.log( page.cookies );
//         fs.write( CookieJar, JSON.stringify( phantom.cookies ), "w" );
//       };
//       page.render( 'login.png' );
//       console.log( page.cookies );
//       fs.write( CookieJar, JSON.stringify( phantom.cookies ), "w" );
//       callback();
//     };
//   };
// }
//
//
// function sendMP() {
//   console.log( "send mp load page", bot.link + '/privmsg?mode=post' );
//   page.open( bot.link + '/privmsg?mode=post', function ( status ) {
//     console.log( "send mp loaded", status, status == 'success' );
//     if ( status == 'success' ) {
//       //includeGetFormInPage( page);
//       res = page.evaluate( function ( bot, destinataire, token, getFormByAction ) {
//
//         form = getFormByAction( bot.link + '/privmsg' );
//         if ( form == null ) {
//           return "login";
//         } else {
//           form.elements[ "username" ].value = destinataire;
//           form.elements[ "subject" ].value = bot.subject;
//           var textareas=form.getElementsByTagName("textarea");
// 	        textareas[textareas.length-1].value = bot.message.replace( "{token}", token );
//           form.elements["post"].click();
//         }
//       }, bot, destinataire, token, getFormByAction )
//       if ( res == "login" ) {
//         console.log( "need connexion" );
//         login();
//       }else {
//         console.log(" mp sended")
//           page.onLoadFinished = function () {
//         page.render("end.png")
//         phantom.exit();
//       }
//       }
//     } else {
//       console.log( "fail sendMP load" );
//         page.render("fail mp")
//       phantom.exit(1);
//     }
//   } );
// }




module.exports = ChromeCtrl;
