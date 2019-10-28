const express = require("express");
const app = express();
const PORT = 3000;
const { Major, Session } = require("../scraper/database")
app.get("/majors", async (req, res) => {
    const majors = await Major.findAll();
    res.send(majors)
});
app.get("/sessions", async (req, res) => {
    const sesh = await Session.findAll();
    res.send(sesh)
})
app.listen(3000, () => {
    console.log(`isotop server running on port: ${PORT}`);
})
