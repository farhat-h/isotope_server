const {accessSync, readFileSync, writeFileSync} = require("fs");
const path = require("path");

const pathToJson = path.resolve(__dirname, "current.json");

function getCurrentDatabaseVersion() {
    try {
        accessSync(pathToJson)
    } catch (e) {
        if (e.code === "ENOENT") {
            writeFileSync(pathToJson, JSON.stringify({current: ""}));
            return "";
        }
    }
    let dbVersion = JSON.parse(readFileSync(pathToJson, {encoding: "utf8"}));
    return dbVersion.current;
}

function setDbVersion(nextVersion = "") {
    const dbVersion = getCurrentDatabaseVersion();
    if (nextVersion !== dbVersion)
        writeFileSync(pathToJson, JSON.stringify({current: nextVersion}));
}

module.exports = {getCurrentDatabaseVersion, setDbVersion};