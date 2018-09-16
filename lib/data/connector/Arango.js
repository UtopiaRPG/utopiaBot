const ar = require('arangojs');
const Database = ar.Database;
var config= require("../../../config.json");

db = new Database({
    url:'http://127.0.0.1:8529'
});

class Arango {

    constructor(){
        this.templateString = ar.aql;
    }

    setClient(client){
        this.client = client;
    }

    getClient(){
        console.log("arango client initialized");
        if(this.client){
            return this.client;
        } else {
            throw  new Error("Bd not initialize");
        }
    }

    query(templateString){
        return this.getClient().query(templateString);
    }
}

const arango = new Arango();
db.useDatabase('utopiaBot');
db.login(config.arango.name,config.arango.password);
arango.setClient(db);

module.exports = arango;