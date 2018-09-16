const db = require("../connector/Arango");
const uuid = require("uuid");

class User extends ArangoModel {

    create(id, name, account_name, account_password, link){
        new this( id, {
            name,
            account_name,
            account_password,
            link
        })
    }
}