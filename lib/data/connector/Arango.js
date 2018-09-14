const ar = require('arangojs');
const Database = ar.Database;

db = new Database('http://127.0.0.1:8529');

class Arango {

    constructor(){
        this.templateString = ar.aqlQuery;
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

db.createDatabase('mydb', function (err) {
    if (!err) {
        db.useDatabase('mydb');
        arango.setClient(db);
    } else {
        console.error('Failed to create database:', err);
    }
});

module.exports = arango;