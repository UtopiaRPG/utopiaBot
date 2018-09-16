const ArangoModel = require("./ArangoModel");

const model = ["name","account_name","account_password","link","checked_role"];

class Forum extends ArangoModel {
    static dataModel (){
        return model;
    }
}


module.exports = Forum;