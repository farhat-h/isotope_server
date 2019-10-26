
class Schedule {
    constructor(document, major) {
        this.document = document;
        this.major = major;
    }
    getSessions() {
        const isScheduleEmpty =
            this.document.querySelector("#dvContainer tbody").innerHTML === "";
        if (isScheduleEmpty) {
            throw new Error(`Schedule for ${major.fullName} is empty`)
        }


    }
}

module.exports = Schedule;