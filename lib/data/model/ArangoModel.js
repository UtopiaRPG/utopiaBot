const db = require("../connector/Arango");

class ArangoModel {
    constructor(id, data){
        this.id = id;
        if(data){
            this.loadJSON(data);
        }
    }

    formatData(data){
        let res = {};
        this.constructor.dataModel().forEach( field => res[field] = data[field]);
        return res
    }

    loadJSON(json){
        this.data = this.formatData(json);
    }

    toJSON(){
        return this.data;
    }

    save(){
        return db
            .query({
                query: 'UPDATE Document(@fid) WITH @values IN '+this.constructor.name,
                bindVars: {
                    fid: `${this.constructor.name}/${this.id}`,
                    values: this.data
                }
            });
    }

    destroy(){
        return db
            .query({
                query: 'REMOVE { _key: @fid } IN @class',
                bindVars: {
                    fid: this.id,
                    class: this.constructor.name
                }
            });
    }

    static create(id, data){
        const forum = new forum(id, data)
        return db
            .query({
                query: 'INSERT @values IN ' + this.constructor.name,
                bindVars: {
                    values: {...this.data, "_key": id}
                }
            }).then(() => forum);
    }

    static findById(id){
        return db
            .query({
                query: 'RETURN DOCUMENT(@fid)',
                bindVars: {
                    fid: `${this.name}/${id}`
                }
            }).then(cursor => cursor.next())
            .then(data => new this(id, data));
    }

    static dataModel (){
        throw new Error(" Class must list field as static dataModel():Array<String>")
    }
}

module.exports = ArangoModel;