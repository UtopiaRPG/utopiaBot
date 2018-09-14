const db = require("../connector/Arango");

class Forum {
    constructor(id){
        this.id = id;
    }

    getDataPromise(){
        if (!this.dataPromise) {
            this.dataPromise = db.query(db.templateString`RETURN DOCUMENT("forums/$")`).then(data => this.data);
        }
        return this.dataPromise;
    }

    save(){
        if (!this.data) {
            throw new Error("can save Empty forum");
        }
        return db.query(db.templateString`UPDATE DOCUMENT("forums/$") WITH ${JSON.stringify(this.data)}`);
    }
}