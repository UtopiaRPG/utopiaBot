
const Bot = require( "../../lib/bot" );
const expect = require( "chai" ).expect;
const EventEmitter = require('events').EventEmitter;
const sinon = require('sinon');
const lang = require("../../lib/lang/fr-fr.json")


const config = {
  modules:['../../test/mockCommand'],
  lang: "fr-fr"
}


describe( "bot", function () {

  it( "mock command reply", () => {
    const client = new EventEmitter();
    const replySpy = sinon.spy(function(message){})
    const message = {
      content: "!UB mock test command",
      reply: replySpy
    };
    const bot = new Bot(config,client);
    client.emit("message", message);
    sinon.assert.called(replySpy);
    expect('{"message":{"content":"!UB mock test command"},"fragments":["!UB","mock","test","command"]}'
    ).to.deep.equals(replySpy.getCall(0).args[0]);
    // sinon.assert.calledWith(replySpy, 'bar', 'baz')
  } );

  it( "unkown command reply", () => {
    const client = new EventEmitter();
    const replySpy = sinon.spy(function(message){})
    const message = {
      content: "!UB unkown test command",
      reply: replySpy
    };
    const bot = new Bot(config,client);
    client.emit("message", message);
    sinon.assert.called(replySpy);
    expect(lang.unknowCommand).to.deep.equals(replySpy.getCall(0).args[0]);
  } );
})
