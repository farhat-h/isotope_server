const express = require("express");
const app = express();
const PORT = 3000;
const {getCurrentDatabaseVersion} = require("../dbs");
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
app.get("/getDb", (req, res) => {

});
app.listen(3000, () => {
    console.log(`isotop server running on port: ${PORT}`);
});
