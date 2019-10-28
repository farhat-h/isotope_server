const Sequelize = require("sequelize");
const path = require("path");

const pathToDatabase = path.resolve(__dirname, "..", "db.sqlite")

Sequelize.Promise = global.Promise;

const sequelize = new Sequelize({
    dialect: "sqlite",
    logging: false,
    storage: pathToDatabase.toString(),
    define: {
        timestamps: false
    }
});


sequelize.Promise = global.Promise;
sequelize.authenticate()
    .then(() => console.log("Connection to db works!"))
    .catch(() => console.error("Cannot create database"));

class Major extends Sequelize.Model { };
class Session extends Sequelize.Model { };

Major.init({
    majorId: { type: Sequelize.STRING, primaryKey: true },
    year: Sequelize.NUMBER,
    group: Sequelize.STRING,
    fullName: Sequelize.STRING,
    majorName: Sequelize.STRING
}, { sequelize });

Session.init({
    day: Sequelize.NUMBER,
    time: Sequelize.STRING,
    subject: Sequelize.STRING,
    professor: Sequelize.STRING,
    type: Sequelize.STRING,
    room: Sequelize.STRING,
    regime: Sequelize.STRING,
    subGroup: Sequelize.NUMBER,
}, { sequelize });

Major.hasMany(Session, { foreignKey: "majorId" });


sequelize.sync().then(() => console.log("database synced"));

module.exports = {
    Session,
    Major
}