const Sequelize = require("sequelize");
const path = require("path");

const pathToDatabase = path.resolve(__dirname, "..", "db.sqlite")
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: pathToDatabase.toString(),
    define: {
        timestamps: false
    }
});


sequelize.authenticate()
    .then(() => console.log("Connection to db works!"))
    .catch(() => console.error("Cannot create database"));

class Major extends Sequelize.Model { };
class Session extends Sequelize.Model { };

Major.init({
    majorId: Sequelize.STRING,
    year: Sequelize.NUMBER,
    group: Sequelize.STRING,
    fullName: Sequelize.STRING,
    majorName: Sequelize.STRING
}, { sequelize });

Session.init({
}, { sequelize });

Major.hasMany(Session);


sequelize.sync().then(() => console.log("database synced"));

module.exports = {
    Session,
    Major
}