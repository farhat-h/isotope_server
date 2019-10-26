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
    .then(crawlSchedules);


async function crawlSchedules(majors = []) {
    const allSessions = [];

    for (let i = 0; i < majors.length; i++) {
        try {
            const body = new formData();
            body.append("jeton", p.token);
            body.append("id", majors[i].id)

            const params = {
                method: "POST",
                headers: new fetch.Headers([["Cookie", p.cookie]]),
                body
            }
            console.log("Fetching "+majors[i].fullName);
            
            const html = await fetch(config.baseUrl, params)
                .then(res => res.text());

            const { document: doc } = new JSDOM(html).window;
            const partialSessions = new Schedule(doc, majors[i]).getSessions();
            allSessions.push(...partialSessions);
        } catch (error) {
            console.error(error);

        }
    }

}