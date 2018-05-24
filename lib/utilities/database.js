
class database {

    constructor(client, host, user, password, database){
        this.knex = require('knex')({
            client: client,
            connection: {
                host: host,
                user: user,
                password: password,
                database: database
            }
        });
    }
}

module.exports = database;