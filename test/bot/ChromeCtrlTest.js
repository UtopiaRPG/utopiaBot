/*launch a mp on forumactif with /lib/bot/phantomCtrl.js and checkout with ./phantom.js the receive of mp*/

const ChromeCtrl = require( "../../lib/bot/ChromeCtrl" );
const expect = require( "chai" ).expect;
const config = require( "../configtest.json" );

// describe( "ChromeCtrl", function () {
//   it( "connect to forum enter in ", (done) => {
//      this.timeout(60000)
//      new ChromeCtrl( config).then( ctrl => {
//        console.log(ctrl)
//       ctrl.login( page => {
//         console.log("page")
//         return page.waitForSelector('#logout').catch( err => err).then(testerDiv =>{
//           console.log("testerDiv")
//           expect(testerDiv).to.exist;
//           expect(page.url()).to.equal(config.forum.link );
//           done();
//         })
//       })
//     });
//   } );
// } );

describe( "ChromeCtrl", function () {
  it( "connect to forum enter in ", async () => {
     this.timeout(60000)
    const ctrl = await new ChromeCtrl( config);
    const page = await ctrl.login();
    const testerDiv = await page.waitForSelector('#logout').catch( err => err)
    expect(testerDiv).to.exist;
    expect(page.url()).to.equal(config.forum.link );
  } );
} );
