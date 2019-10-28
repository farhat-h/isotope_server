const Sequelize = require("sequelize");
const path = require("path");
const pathToDbs = path.resolve(__dirname, "dbs/");

class Database {
    constructor(databaseName = "db.sqlite") {
        this.databaseName = databaseName.endsWith(".sqlite") ? databaseName : databaseName + ".sqlite";
        const pathToDatabase = path.join(pathToDbs, this.databaseName);

        this.sequelize = new Sequelize({
            dialect: "sqlite",
            logging: false,
            storage: pathToDatabase.toString(),
            define: {
                timestamps: false
            }
        });


        this.Major = class Major extends Sequelize.Model {
        };

        this.Session = class Session extends Sequelize.Model {
        };

        this.Major.init({
            majorId: {type: Sequelize.STRING, primaryKey: true},
            year: Sequelize.NUMBER,
            group: Sequelize.STRING,
            fullName: Sequelize.STRING,
            majorName: Sequelize.STRING
        }, {sequelize: this.sequelize});

        this.Session.init({
            day: Sequelize.NUMBER,
            time: Sequelize.STRING,
            subject: Sequelize.STRING,
            professor: Sequelize.STRING,
            type: Sequelize.STRING,
            room: Sequelize.STRING,
            regime: Sequelize.STRING,
            subGroup: Sequelize.NUMBER,
        }, {sequelize: this.sequelize});

        this.Major.hasMany(this.Session, {foreignKey: "majorId"});
    }

    initialize() {
        return this.sequelize.sync();
    }

    destroy () {
        return this.sequelize.close();
    }
}

module.exports = Database;