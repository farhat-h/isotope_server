const fetch = require("node-fetch");
const {JSDOM} = require("jsdom");
const Major = require("./Major");
const Database = require("../database");

const {getCurrentDatabaseVersion} = require("../dbs");

const config = {
    baseUrl: "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php"
};


class Parser {
    constructor() {
        this.document = null;
        this.majors = null;
        this.token = null;
        this.cookie = null;
        this.databaseName = null;
    }

    initialize() {
        return fetch(config.baseUrl).then(res => {
            const [cookie] = res.headers.get("set-cookie").split(";");
            this.cookie = cookie;
            return res.text();
        }).then(html => {
            const {document} = new JSDOM(html).window;
            this.document = document;
            this.databaseName = /:\s(.*)$/.exec(this.document.querySelector(".content.container center h5").textContent)[1].trim() + ".sqlite";
            const lastDbVersion = getCurrentDatabaseVersion();
            console.log(`found value: ${this.databaseName}, old value: ${lastDbVersion}\n`);
            if (this.databaseName === lastDbVersion) {
                // no need  to do anything
                process.exit(0);
            }
            this.database = new Database(this.databaseName);
            return this.database.initialize();
        }).then(() => {
            this.token = this.document.querySelector("input[type=hidden][name=jeton]").value;
            this.majors = Array.from(this.document.querySelectorAll("select[name=id] option")).map(item => new Major(item));
            return Promise.resolve(this.majors);
        });
    }
}

module.exports = Parser;