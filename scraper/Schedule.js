const Session = require("./Session");
const r_subgroup = /(\d)$/;
const r_day = /^(\d)-(Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi)$/;
class Schedule {

  constructor(document, major) {
    this.document = document;
    this.major = major;
  }
  getSessions() {
    const data = [];
    const isScheduleEmpty =
      this.document.querySelector("#dvContainer tbody") === null;
    if (isScheduleEmpty) {
      throw new Error("no-schedule-error")
    }
    let sessions = Array.from(this.document.querySelectorAll("#dvContainer tbody tr"));
    let subGroup = 1;
    let day = 1;
    for (let i = 0; i < sessions.length; i++) {
      let sesh = sessions[i];
      const [firstCell] = sesh.children;

      if (firstCell.textContent !== "" && firstCell.textContent.includes(this.major.fullName)) {

        const [_, subg] = r_subgroup.exec(firstCell.textContent);
        subGroup = subg;

      } else if (r_day.test(firstCell.textContent)) {

        const [_, d] = r_day.exec(firstCell.textContent);
        day = d;

      } else if (sesh.textContent === "") {
        continue;
      } else {

        const time = sesh.children[1].textContent;
        const subject = sesh.children[4].textContent;
        const professor = sesh.children[5].textContent;
        const type = sesh.children[6].textContent;
        const room = sesh.children[7].textContent;
        const regime = sesh.children[8].textContent;

        data.push(new Session({ day, time, subject, professor, type, room, regime, majorId: this.major.id, subGroup }).serialized())
      }
    }
    return data;
  }
}

module.exports = Schedule;
