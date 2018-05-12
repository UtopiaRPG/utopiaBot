// var system = require( 'system' );
// var page = require( 'webpage' ).create();
// page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
// page.settings.javascriptEnabled = true;
// page.settings.loadImages = false;//Script is much faster with this field set to false
// phantom.cookiesEnabled = true;
// phantom.javascriptEnabled = true;


var puppeteer = require("puppeteer")

 class ChromeCtrl {
  constructor(config){
    this.loadConfig(config);
    return puppeteer.launch().then(b => {
      console.log("browser",b);
      this.browser = b;
      return this
    });
  }

  loadConfig(config){
    this.config = {
      name: config.name || "utopiaBot",
      password: config.password,
      link: config.forum.link,
      message: config.message || "voici le token pour Discord : \n \n !UB token {token}",
      subject: config.messageTitle || "Token Discord"
    };
  }

  getFormByAction( action ) {
    return page.waitForXPath('//*[action="'+action+'"]');
  }

  login(){
    console.log(this.browser)
    return this.browser.newPage().then( page => {
      const response = page.goto(this.config.link + '/login');

      return page;
    }).then(page => {
      return page.goto(this.config.link + '/login').then( response=> {
        if ( response.ok() ) {
          const form = page.waitForXPath('//*[action="' + '/login' + '"]');
          return form.$x('//*[name="username"]').then( elements =>{
            elements[0].focus();
            this.page.keyboard.type(this.congif.name);
            return form.$x('//*[name="password"]').focus().then(elements =>{
              elements[0].focus();
              this.page.keyboard.type(this.congif.password);
              return form.$x('//*[name="login"]').then(elements => {
                elements[0].click();
                return page;
              });
            });
          })
        } else {
            console.log( "fail login" );
            //throw error
        }
      })
    })
  }

  goToAndDo(uri ){

  }

  sendMP(){

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
