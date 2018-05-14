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
              return this._log( page, "loginfill" ).then( page => form )
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
          } )
        } else {
          throw new Error( "fail login" )
        }
      } )
    } )
  }

  listMP() {
    return this.browser.newPage().then( page => {
      return this._goTo( page, '/privmsg?folder=inbox' ).then( response => {
        return page.$x( '//*[@class="box-content"]//td[.//*[@class="topictitle"]]' )
      } ).then( elements => {
        return Promise.all( elements.map( tdElement =>
          tdElement.$x( '//*[@class="topictitle"]' ).then( elements => {
            return elements[ 0 ].getProperty( 'innerHTML' )
          } ).then( handle => {
            return handle.jsonValue().then( value => {
              return {
                name: value
              }
            } )
          } )
        ) );
      } )
    } )
  }

  sendMP( dest, subject, message ) {
    return this.browser.newPage().then( page => {
      return this._goTo( page, '/privmsg?mode=post' ).then( response => {
        if ( response.ok() ) {
          return this._fillForm( page, '/privmsg', {
            "username[]": dest,
            subject: subject
          } ).then( form => {
            return form.$x( '//*[contains(@class,"sceditor-container")]//textarea' ).then( elements => {
              return this._focusAndSendText( page, elements[ 0 ], message ).then( () => {
                return form;
              } )
            } );
          } ).then( form => {
            return this._log( page, "sendMPfill" ).then( page => form )
          } ).then( form => {
            return form.$x( '//*[@name="post" and @type="submit"]' ).then( elements => {
              const navigationPromise = page.waitForNavigation().then(() => {
                return page.$x( '//*[@action="/privmsg"]' ).then( element => {
                  if ( element.length  ) {
                    throw new Error( "User not found" );
                  } else {
                    return page;
                  }
                } );
              });
              elements[0].click();
              return navigationPromise;
            } );
          } );
        } else {
          throw new Error( "fail sendMP load" );
        }
      } )
    } );
  }

  /*private*/

  _fillForm( page, action, params ) {
    let promise = page.waitForXPath( '//*[@action="' + action + '"]' );
    for ( let prop in params ) {
      promise = this._fillformChainPromise( promise, page, prop, params[ prop ] );
    }

    return promise;
  }

  _fillformChainPromise( promise, page, prop, val ) {
    return promise.then( form => {
      return form.$x( '//*[@name="' + prop + '"]' ).then( elements => {
        return this._focusAndSendText( page, elements[ 0 ], val ).then( () => {
          return form;
        } )
      } );
    } )
  }

  _focusAndSendText( page, target, text ) {
    target.focus();
    return page.keyboard.type( text )
  }

  _log( page, namePath ) {
    //maybe use strat here in futur
    return page.screenshot( {
      path: namePath + ".png",
      fullPage: true
    } ).then( () => page );
  }

  _goTo( page, uri ) {
    return page.goto( this.config.link + uri )
  }
}

module.exports = ChromeCtrl;
