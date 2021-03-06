const fetch = require("node-fetch");
const Parser = require("./Parser");
const formData = require("form-data");
const { JSDOM } = require("jsdom");
const Schedule = require("./Schedule");
const { setDbVersion } = require("../dbs");
const config = {
    baseUrl: "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php"
}


const p = new Parser();


async function crawlSchedules(majors = []) {
    console.time("download time");
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
            const html = await fetch(config.baseUrl, params)
                .then(res => res.text());

            const { document: doc } = new JSDOM(html).window;
            const partialSessions = new Schedule(doc, majors[i]).getSessions();

            await p.database.Major.create(majors[i].serialized());
            await p.database.Session.bulkCreate(partialSessions);

            console.log(majors[i].fullName + " DOWNLOADED!");
        } catch (error) {
            // ERROR HANDLING
            console.log("found an error when parsing: " + majors[i].fullName);
            if (error.type === "error.code" && error.errno === "ETIMEDOUT") {
                throw (error);
            }
        }
    }
    console.timeEnd("download time");
    return true

}

p.initialize()
    .then(crawlSchedules)
    .then(() => setDbVersion(p.databaseName));
