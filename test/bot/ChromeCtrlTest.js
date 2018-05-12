/*launch a mp on forumactif with /lib/bot/phantomCtrl.js and checkout with ./phantom.js the receive of mp*/

const ChromeCtrl = require( "../../lib/bot/ChromeCtrl" );
const expect = require( "chai" ).expect;
const config = require( "../configtest.json" );

describe( "ChromeCtrl", function () {
  it( "connect to forum enter in ",  () => {
     this.timeout(60000)
    console.log( ChromeCtrl );
    const p  = new ChromeCtrl( config ).then( ( ctrl ) => {
      console.log( ctrl )
      return ctrl.login().then( page => {
        console.log( page )
        expect( page.content() ).to.deep.equal( config );
      } ).catch(err => {console.log(err)});
    } )
    console.log(p);
    return p
  } );
} );
