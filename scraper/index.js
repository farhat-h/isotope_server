const EventEmitter = require("events");
const request = require("request-promise-native");
const Major = require("./Major");
const Schedule = require("./Schedule");
const { JSDOM } = require("jsdom");
const Database = require("../database");
const { getCurrentDatabaseVersion, setDbVersion } = require("../dbs");

const URL = "http://www.issatso.rnu.tn/fo/emplois/emploi_groupe.php";
class Crawler extends EventEmitter {
  constructor() {
    super();
    this.document = null;
    this.majors = null;
    this.token = null;
    this.cookie = null;
    this.databaseName = null;
    this.retryQueue = [];

    this.on("setup-db", this._setupDB);
    this.on("begin-parsing", this._parse);
    this.on("insert-data", this._onInsertData);
    this.on("no-body-error", this._onError);
    this.on("start-retry-queue", this._startRetryQueue);
    this.on("done", this._onDone);
    this.init();
  }
  async init() {
    console.time("download-time");
    const res = await request(URL, {
      method: "GET",
      resolveWithFullResponse: true
    });
    const _cookie = res.headers["set-cookie"][0].split(";")[0];
    this.cookie = _cookie;

    const _document = new JSDOM(res.body).window.document;
    this.document = _document;

    const _databaseName =
      /:\s(.*)$/
        .exec(
          this.document.querySelector(".content.container center h5")
            .textContent
        )[1]
        .trim() + ".sqlite";

    const _token = this.document.querySelector("input[type=hidden][name=jeton]")
      .value;
    this.token = _token;

    this.emit("setup-db", _databaseName);
  }
  _onError(major) {
    console.log(major.fullName + "has no schedule yet");
  }
  async _onInsertData(data, collection) {
    switch (collection) {
      case "majors":
        try {
          await this.database.Major.bulkCreate(data.map(m => m.serialized()));
          console.log("MAJORS INSERTED");
        } catch (error) {
          console.error(error.message);
          process.exit(1);
        }

        break;
      case "sessions":
        try {
          await this.database.Session.bulkCreate(data);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
        break;
      default:
        break;
    }
  }

  async _parse() {
    this.majors = Array.from(
      this.document.querySelectorAll("select[name=id] option")
    ).map(item => new Major(item));

    this.emit("insert-data", this.majors, "majors");

    await Promise.all(this.majors.map(m => this._parseMajorSchedule(m)));
    this.emit("start-retry-queue");
  }
  async _parseMajorSchedule(major) {
    const body = {
      jeton: this.token,
      id: major.id
    };
    let r = null;
    try {
      r = await request.post(URL, {
        timeout: 30 * 1000,
        headers: { Cookie: this.cookie },
        form: body
      });
    } catch (error) {
      console.log("error requesting schedule for " + major.fullName);
    }
    if (r === null) {
      this.retryQueue.push(major);
      return;
    }
    const { document } = new JSDOM(r).window;
    let s = null;
    try {
      s = new Schedule(document, major).getSessions();
    } catch (error) {
      if (error.message === "no-schedule-error")
        this.emit("no-body-error", major);
      else console.log(error);
    }
    if (s !== null) {
      this.emit("insert-data", s, "sessions");
      console.log("downloaded " + major.fullName);
    }
  }
  async _setupDB(dbName) {
    const lastDbVersion = getCurrentDatabaseVersion();
    if (dbName === lastDbVersion) {
      console.log("DATABASE ALREADY AQUIRED\n exiting.");
      process.exit(0);
    } else {
      console.log("CREATING A NEW DATABASE: " + dbName);
      this.databaseName = dbName;
      this.database = new Database(this.databaseName);
      await this.database.initialize();
      this.emit("begin-parsing");
    }
  }
  _onDone() {
    setDbVersion(this.databaseName);
    console.timeEnd("download-time");
  }
  async _startRetryQueue() {
    console.log("starting sequential queue for failed attempts");
    if (this.retryQueue.length != 0) {
      for (let i = 0; i < this.retryQueue.length; i++) {
        const major = this.retryQueue[i];
        await this._parseMajorSchedule(major);
      }
    }
    this.emit("done");
  }
}

new Crawler();
