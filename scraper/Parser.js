const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const Major = require("./Major")

const config = {
    baseUrl: "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php"
}


class Parser {
    constructor() {
        this.document = null;
        this.majors = null;
        this.token = null;
        this.cookie = null;
    }
    initialize() {
        return fetch(config.baseUrl).then(res => {
            const [cookie] = res.headers.get("set-cookie").split(";");
            this.cookie = cookie;
            return res.text();
        }).then(html => {
            const { document } = new JSDOM(html).window;
            this.document = document;
            return Promise.resolve(document);
        }).then(document => {
            this.token = this.document.querySelector("input[type=hidden][name=jeton]").value
            this.majors = Array.from(this.document.querySelectorAll("select[name=id] option")).map(item => new Major(item));
            return Promise.resolve(this.majors);
        });
    }
}

module.exports = Parser