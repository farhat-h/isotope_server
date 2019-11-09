const Sequelize = require("sequelize");
const path = require("path");
const pathToDbs = path.resolve(__dirname, "dbs/");

class Database {
  constructor(databaseName = "db.sqlite") {
    this.databaseName = databaseName.endsWith(".sqlite")
      ? databaseName
      : databaseName + ".sqlite";
    const pathToDatabase = path.join(pathToDbs, this.databaseName);

    this.sequelize = new Sequelize({
      dialect: "sqlite",
      logging: false,
      storage: pathToDatabase.toString(),
      define: {
        timestamps: false
      }
    });

    this.Major = class Major extends Sequelize.Model {};

    this.Session = class Session extends Sequelize.Model {};

    this.Major.init(
      {
        majorId: {
          type: Sequelize.TEXT,
          primaryKey: true,
          allowNull: false
        },
        year: Sequelize.TEXT,
        group: Sequelize.TEXT,
        fullName: Sequelize.TEXT,
        majorName: Sequelize.TEXT
      },
      {
        sequelize: this.sequelize
      }
    );

    this.Session.init(
      {
        sessionId: {
          type: Sequelize.TEXT,
          primaryKey: true,
          allowNull: false
        },
        day: { type: Sequelize.INTEGER, allowNull: false },
        time: Sequelize.TEXT,
        subject: Sequelize.TEXT,
        professor: Sequelize.TEXT,
        type: Sequelize.TEXT,
        room: Sequelize.TEXT,
        regime: Sequelize.TEXT,
        subGroup: { type: Sequelize.INTEGER, allowNull: false }
      },
      { sequelize: this.sequelize }
    );

    this.Major.hasMany(this.Session, { foreignKey: "majorId" });
  }

  initialize() {
    return this.sequelize.sync();
  }

  destroy() {
    return this.sequelize.close();
  }
}

module.exports = Database;
