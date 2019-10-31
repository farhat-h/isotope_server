const express = require("express");
const app = express();
const PORT = 3001;
const { getCurrentDatabaseVersion } = require("../dbs");
const Database = require("../database");
let database = new Database(getCurrentDatabaseVersion());

setInterval(async () => {
    await database.destroy();
    database = new Database(getCurrentDatabaseVersion());
    console.log("DATABASE CHECKED/UPDATED")
}, 3600 * 1000);

app.get("/version", (req, res) => {
    res.send(database.databaseName);
});
app.get("/majors", async (req, res) => {
    const majors = await database.Major.findAll();
    res.send(majors)
});
app.get("/sessions", async (req, res) => {
    const sesh = await database.Session.findAll();
    res.send(sesh)
});


app.get("/sessions/:majorId", async (req, res) => {
    const { majorId } = req.params;
    console.time("query-benchmark");

    const sessions = await database.Major.findOne({
        where: { majorId: majorId },
        include: [
            {
                model: database.Session,
                attributes: [
                    "day",
                    "time",
                    "subject",
                    "professor",
                    "type",
                    "room",
                    "regime",
                    "subGroup",
                ]
            }
        ]
    });
    if (sessions === null) {
        console.timeEnd("query-benchmark");
        res.status(404).send({ error: "cannot find major" });

    }
    console.timeEnd("query-benchmark");
    res.send(sessions)

});
app.get("/getDb", (req, res) => {

});
app.listen(PORT, () => {
    console.log(`isotop server running on port: ${PORT}`);
});
