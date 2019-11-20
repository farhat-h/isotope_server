const express = require("express");
const app = express();
const PORT = 3001;
const path = require("path");
const { getCurrentDatabaseVersion } = require("../dbs");
const Database = require("../database");
let database = new Database(getCurrentDatabaseVersion());
const bodyParser = require("body-parser");

const cors = require("cors");

setInterval(async () => {
  await database.destroy();
  database = new Database(getCurrentDatabaseVersion());
  console.log("DATABASE CHECKED/UPDATED");
}, 3600 * 1000);

app.use(express.static(path.resolve(__dirname, "build/")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/version", (req, res) => {
  res.send(database.databaseName);
});
app.get("/api/majors", async (req, res) => {
  const majors = await database.Major.findAll();
  res.send(majors);
});
app.get("/api/sessions", async (req, res) => {
  const sesh = await database.Session.findAll();
  res.send(sesh);
});

app.post("/api/sessions/alternatives", async (req, res) => {
  const { body } = req;
  if (hasProperties(body, "majorName year day time")) {
    const alternatives = await database.Major.findAll({
      where: {
        majorName: body.majorName,
        year: body.year
      },
      include: {
        model: database.Session,
        attributes: { exclude: "majorId" },
        where: {
          day: body.day,
          time: body.time
        }
      }
    });
    res.send(alternatives);
  } else {
    res.status(500).send("invalid params");
  }
});

app.get("/api/sessions/:majorId", async (req, res) => {
  const { majorId } = req.params;
  console.time("query-benchmark");

  const sessions = await database.Major.findOne({
    where: { majorId: majorId },
    include: [
      {
        model: database.Session,
        attributes: { exclude: "majorId" }
      }
    ]
  });
  if (sessions === null) {
    console.timeEnd("query-benchmark");
    res.status(404).send({ error: "cannot find major" });
  }
  console.timeEnd("query-benchmark");
  res.send(sessions);
});

app.get("/api/getLastDatabaseVersion", (req, res) => {
  const db = getCurrentDatabaseVersion();
  const pathToDatabase = path.resolve(__dirname, "..", "dbs/", db);

  res.download(pathToDatabase, "database.sqlite");
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`isotop server running on port: ${PORT}`);
});

function hasProperties(obj, properties = "") {
  const props = properties.split(" ");
  const verdict = props.reduce((acc, next) => {
    return acc && obj.hasOwnProperty(next);
  }, true);
  return verdict;
}
