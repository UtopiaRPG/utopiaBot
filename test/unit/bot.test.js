
const Bot = require( "../../lib/bot" );
const expect = require( "chai" ).expect;
const EventEmitter = require('events').EventEmitter;
const sinon = require('sinon');


const config = {
  modules:['../../test/mockModule'],
}


describe( "bot", function () {

  it( "unkown command reply", async() => {
    const client = new EventEmitter();
    const replySpy = sinon.spy(function(message){})
    emitter.on('foo', spy);
    const message = sinon.mock({
      content: "!UB unkown test command",
      reply: replySpy
    });
    const bot = new Bot(config,client);
    client.emit("message", message);
    sinon.assert.calledWith(spy, 'bar', 'baz')
  } );
})
