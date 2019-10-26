const fetch = require("node-fetch");
const Parser = require("./src/Parser");
const formData = require("form-data");
const { JSDOM } = require("jsdom");
const Schedule = require("./src/Schedule");

const config = {
    baseUrl: "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php"
}

const p = new Parser();

p.initialize()
    .then(async function (majors) {
        try {
            const body = new formData();
            body.append("jeton", p.token);
            body.append("id", majors[0].id)

            const params = {
                method: "POST",
                headers: new fetch.Headers([["Cookie", p.cookie]]),
                body
            }

            const html = await fetch(config.baseUrl, params)
                .then(res => res.text());

            const { document: doc } = new JSDOM(html).window;
            const s = new Schedule(doc, majors[0]).getSessions();
        } catch (error) {
            console.error(error);

        }
    }) 